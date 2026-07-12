import { supabase, isNetworkError } from '../config/supabase.js'
import { transitopsStore } from '../utils/transitopsStore.js'
import { BusinessRules } from '../utils/businessRules.js'

export async function getVehicles(req, res) {
  try {
    const { status, type, region, search } = req.query
    let list = [...transitopsStore.vehicles]

    try {
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (status && status !== 'All') {
      list = list.filter(v => v.status === status)
    }
    if (type && type !== 'All') {
      list = list.filter(v => v.vehicle_type === type)
    }
    if (region && region !== 'All') {
      list = list.filter(v => v.region === region)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(v =>
        v.registration_number.toLowerCase().includes(q) ||
        v.vehicle_name.toLowerCase().includes(q)
      )
    }

    return res.json({ success: true, data: list })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function getVehicleById(req, res) {
  try {
    const { id } = req.params
    let vehicle = transitopsStore.vehicles.find(v => v.id === id)

    try {
      const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single()
      if (!error && data) vehicle = data
    } catch (_) {}

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    const trips = transitopsStore.trips.filter(t => t.vehicle_id === id)
    const fuelLogs = transitopsStore.fuel_logs.filter(f => f.vehicle_id === id)
    const maintenanceLogs = transitopsStore.maintenance_logs.filter(m => m.vehicle_id === id)
    const expenses = transitopsStore.expenses.filter(e => e.vehicle_id === id)

    const totalRevenue = trips.reduce((acc, t) => acc + Number(t.actual_revenue || t.planned_revenue || 0), 0)
    const totalFuelCost = fuelLogs.reduce((acc, f) => acc + Number(f.cost || 0), 0)
    const totalMaintenanceCost = maintenanceLogs.reduce((acc, m) => acc + Number(m.cost || 0), 0)
    const acquisitionCost = Number(vehicle.acquisition_cost || 1000000)

    const roi = acquisitionCost > 0
      ? ((totalRevenue - totalFuelCost - totalMaintenanceCost) / acquisitionCost) * 100
      : 0

    return res.json({
      success: true,
      data: {
        ...vehicle,
        trip_history: trips,
        fuel_logs: fuelLogs,
        maintenance_history: maintenanceLogs,
        expenses,
        metrics: {
          total_revenue: totalRevenue,
          total_fuel_cost: totalFuelCost,
          total_maintenance_cost: totalMaintenanceCost,
          roi: Number(roi.toFixed(2))
        }
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createVehicle(req, res) {
  try {
    const {
      registration_number,
      vehicle_name,
      vehicle_type,
      max_load_capacity,
      odometer,
      acquisition_cost,
      status,
      region
    } = req.body

    // BR-001: Unique Registration Number check
    BusinessRules.validateUniqueRegistration(registration_number, transitopsStore.vehicles)

    const newVehicle = {
      id: `v-${Date.now()}`,
      registration_number,
      vehicle_name,
      vehicle_type,
      max_load_capacity: Number(max_load_capacity || 0),
      odometer: Number(odometer || 0),
      acquisition_cost: Number(acquisition_cost || 0),
      status: status || 'Available',
      region: region || 'West Bengal',
      created_at: new Date().toISOString()
    }

    try {
      await supabase.from('vehicles').insert([newVehicle])
    } catch (_) {}

    transitopsStore.vehicles.unshift(newVehicle)

    return res.status(201).json({ success: true, data: newVehicle })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

export async function updateVehicle(req, res) {
  try {
    const { id } = req.params
    const index = transitopsStore.vehicles.findIndex(v => v.id === id)
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    if (req.body.registration_number) {
      BusinessRules.validateUniqueRegistration(req.body.registration_number, transitopsStore.vehicles, id)
    }

    const updated = { ...transitopsStore.vehicles[index], ...req.body, updated_at: new Date().toISOString() }
    transitopsStore.vehicles[index] = updated

    try {
      await supabase.from('vehicles').update(req.body).eq('id', id)
    } catch (_) {}

    return res.json({ success: true, data: updated })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

export async function deleteVehicle(req, res) {
  try {
    const { id } = req.params
    const index = transitopsStore.vehicles.findIndex(v => v.id === id)
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    transitopsStore.vehicles.splice(index, 1)

    try {
      await supabase.from('vehicles').delete().eq('id', id)
    } catch (_) {}

    return res.json({ success: true, message: 'Vehicle removed successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
