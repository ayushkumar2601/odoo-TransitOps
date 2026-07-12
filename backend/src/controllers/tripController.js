import { supabase } from '../config/supabase.js'
import { transitopsStore } from '../utils/transitopsStore.js'
import { BusinessRules } from '../utils/businessRules.js'

export async function getTrips(req, res) {
  try {
    const { status, vehicle_id, driver_id } = req.query
    let list = [...transitopsStore.trips]

    try {
      const { data, error } = await supabase.from('trips').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (status && status !== 'All') {
      list = list.filter(t => t.status === status)
    }
    if (vehicle_id) {
      list = list.filter(t => t.vehicle_id === vehicle_id)
    }
    if (driver_id) {
      list = list.filter(t => t.driver_id === driver_id)
    }

    // Enrich trips with vehicle and driver info
    const enriched = list.map(t => {
      const vehicle = transitopsStore.vehicles.find(v => v.id === t.vehicle_id)
      const driver = transitopsStore.drivers.find(d => d.id === t.driver_id)
      return { ...t, vehicle, driver }
    })

    return res.json({ success: true, data: enriched })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function getTripById(req, res) {
  try {
    const { id } = req.params
    let trip = transitopsStore.trips.find(t => t.id === id)

    try {
      const { data, error } = await supabase.from('trips').select('*').eq('id', id).single()
      if (!error && data) trip = data
    } catch (_) {}

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' })
    }

    const vehicle = transitopsStore.vehicles.find(v => v.id === trip.vehicle_id)
    const driver = transitopsStore.drivers.find(d => d.id === trip.driver_id)

    return res.json({ success: true, data: { ...trip, vehicle, driver } })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createTrip(req, res) {
  try {
    const {
      trip_code,
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight,
      planned_distance,
      planned_revenue
    } = req.body

    const vehicle = transitopsStore.vehicles.find(v => v.id === vehicle_id)
    if (!vehicle) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle_id' })
    }

    // BR-008: Validate Cargo Weight <= Vehicle Max Load Capacity
    BusinessRules.validateCargoCapacity(cargo_weight, vehicle.max_load_capacity)

    const newTrip = {
      id: `trp-${Date.now()}`,
      trip_code: trip_code || `TRP-${Date.now().toString().slice(-6)}`,
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight: Number(cargo_weight || 0),
      planned_distance: Number(planned_distance || 0),
      planned_revenue: Number(planned_revenue || 0),
      actual_distance: null,
      actual_revenue: null,
      fuel_consumed: null,
      start_odometer: vehicle.odometer,
      end_odometer: null,
      status: 'Draft',
      created_at: new Date().toISOString()
    }

    try {
      await supabase.from('trips').insert([newTrip])
    } catch (_) {}

    transitopsStore.trips.unshift(newTrip)
    return res.status(201).json({ success: true, data: newTrip })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

/**
 * Dispatch Trip (BR-002, BR-003, BR-004, BR-005, BR-006, BR-007, BR-008, BR-009)
 */
export async function dispatchTrip(req, res) {
  try {
    const { id } = req.params
    const trip = transitopsStore.trips.find(t => t.id === id)
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' })
    }

    const vehicle = transitopsStore.vehicles.find(v => v.id === trip.vehicle_id)
    const driver = transitopsStore.drivers.find(d => d.id === trip.driver_id)

    // Run full dispatch eligibility checks
    BusinessRules.validateVehicleForDispatch(vehicle)
    BusinessRules.validateDriverForDispatch(driver)
    BusinessRules.validateCargoCapacity(trip.cargo_weight, vehicle.max_load_capacity)

    // Transition trip and apply BR-009 transitions
    trip.status = 'Dispatched'
    trip.start_odometer = vehicle.odometer
    trip.updated_at = new Date().toISOString()
    BusinessRules.applyDispatchTransitions(vehicle, driver)

    try {
      await supabase.from('trips').update({ status: 'Dispatched', start_odometer: vehicle.odometer }).eq('id', id)
      await supabase.from('vehicles').update({ status: 'On Trip' }).eq('id', vehicle.id)
      await supabase.from('drivers').update({ status: 'On Trip' }).eq('id', driver.id)
    } catch (_) {}

    return res.json({
      success: true,
      message: 'Trip dispatched successfully under BR-009 validation rules.',
      data: trip
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

/**
 * Complete Trip (BR-010)
 */
export async function completeTrip(req, res) {
  try {
    const { id } = req.params
    const { end_odometer, fuel_consumed, actual_revenue, actual_distance } = req.body

    const trip = transitopsStore.trips.find(t => t.id === id)
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' })
    }

    const vehicle = transitopsStore.vehicles.find(v => v.id === trip.vehicle_id)
    const driver = transitopsStore.drivers.find(d => d.id === trip.driver_id)

    trip.status = 'Completed'
    trip.end_odometer = Number(end_odometer || (trip.start_odometer + (actual_distance || trip.planned_distance)))
    trip.actual_distance = Number(actual_distance || (trip.end_odometer - trip.start_odometer) || trip.planned_distance)
    trip.fuel_consumed = Number(fuel_consumed || 0)
    trip.actual_revenue = Number(actual_revenue || trip.planned_revenue)
    trip.updated_at = new Date().toISOString()

    // BR-010 transitions
    if (vehicle && driver) {
      BusinessRules.applyCompletionTransitions(vehicle, driver, trip.end_odometer)
    }

    // Automatically log fuel consumption if fuel_consumed > 0
    if (trip.fuel_consumed > 0 && vehicle) {
      const fuelCost = trip.fuel_consumed * 95 // approx INR 95 per liter diesel
      const newFuelLog = {
        id: `f-${Date.now()}`,
        vehicle_id: vehicle.id,
        trip_id: trip.id,
        liters: trip.fuel_consumed,
        cost: fuelCost,
        fuel_station: 'Auto-Logged Station on Completion',
        date: new Date().toISOString()
      }
      transitopsStore.fuel_logs.unshift(newFuelLog)
      transitopsStore.expenses.unshift({
        id: `e-${Date.now()}`,
        vehicle_id: vehicle.id,
        category: 'Fuel',
        amount: fuelCost,
        notes: `Trip fuel for ${trip.trip_code}`,
        expense_date: new Date().toISOString()
      })
    }

    try {
      await supabase.from('trips').update(trip).eq('id', id)
      if (vehicle) await supabase.from('vehicles').update({ status: 'Available', odometer: vehicle.odometer }).eq('id', vehicle.id)
      if (driver) await supabase.from('drivers').update({ status: 'Available' }).eq('id', driver.id)
    } catch (_) {}

    return res.json({
      success: true,
      message: 'Trip completed successfully under BR-010 rules.',
      data: trip
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

/**
 * Cancel Trip (BR-011)
 */
export async function cancelTrip(req, res) {
  try {
    const { id } = req.params
    const trip = transitopsStore.trips.find(t => t.id === id)
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' })
    }

    const vehicle = transitopsStore.vehicles.find(v => v.id === trip.vehicle_id)
    const driver = transitopsStore.drivers.find(d => d.id === trip.driver_id)

    trip.status = 'Cancelled'
    trip.updated_at = new Date().toISOString()

    // BR-011 restore availability
    BusinessRules.applyCancellationTransitions(vehicle, driver)

    try {
      await supabase.from('trips').update({ status: 'Cancelled' }).eq('id', id)
      if (vehicle) await supabase.from('vehicles').update({ status: 'Available' }).eq('id', vehicle.id)
      if (driver) await supabase.from('drivers').update({ status: 'Available' }).eq('id', driver.id)
    } catch (_) {}

    return res.json({
      success: true,
      message: 'Trip cancelled and resources restored to Available under BR-011.',
      data: trip
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}
