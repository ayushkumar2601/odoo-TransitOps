import { supabase } from '../config/supabase.js'
import { transitopsStore } from '../utils/transitopsStore.js'

export async function getDrivers(req, res) {
  try {
    const { status, search } = req.query
    let list = [...transitopsStore.drivers]

    try {
      const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (status && status !== 'All') {
      list = list.filter(d => d.status === status)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.license_number.toLowerCase().includes(q)
      )
    }

    return res.json({ success: true, data: list })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function getDriverById(req, res) {
  try {
    const { id } = req.params
    let driver = transitopsStore.drivers.find(d => d.id === id)

    try {
      const { data, error } = await supabase.from('drivers').select('*').eq('id', id).single()
      if (!error && data) driver = data
    } catch (_) {}

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' })
    }

    const trips = transitopsStore.trips.filter(t => t.driver_id === id)
    const completedTrips = trips.filter(t => t.status === 'Completed').length
    const activeTrip = trips.find(t => t.status === 'Dispatched') || null
    const assignedVehicle = activeTrip
      ? transitopsStore.vehicles.find(v => v.id === activeTrip.vehicle_id) || null
      : null

    const isLicenseExpired = new Date(driver.license_expiry_date) < new Date()
    const licenseStatus = isLicenseExpired ? 'Expired' : 'Valid'

    return res.json({
      success: true,
      data: {
        ...driver,
        trips_completed: completedTrips,
        license_status: licenseStatus,
        assigned_vehicle: assignedVehicle,
        trip_history: trips
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createDriver(req, res) {
  try {
    const {
      name,
      license_number,
      license_category,
      license_expiry_date,
      contact_number,
      safety_score,
      status
    } = req.body

    const existing = transitopsStore.drivers.find(d => d.license_number.toLowerCase() === (license_number || '').toLowerCase())
    if (existing) {
      return res.status(400).json({ success: false, message: 'Driver license number must be unique' })
    }

    const newDriver = {
      id: `d-${Date.now()}`,
      name,
      license_number,
      license_category: license_category || 'HMV (Heavy Motor Vehicle)',
      license_expiry_date,
      contact_number,
      safety_score: Number(safety_score || 90.0),
      status: status || 'Available',
      created_at: new Date().toISOString()
    }

    try {
      await supabase.from('drivers').insert([newDriver])
    } catch (_) {}

    transitopsStore.drivers.unshift(newDriver)
    return res.status(201).json({ success: true, data: newDriver })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

export async function updateDriver(req, res) {
  try {
    const { id } = req.params
    const index = transitopsStore.drivers.findIndex(d => d.id === id)
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Driver not found' })
    }

    const updated = { ...transitopsStore.drivers[index], ...req.body, updated_at: new Date().toISOString() }
    transitopsStore.drivers[index] = updated

    try {
      await supabase.from('drivers').update(req.body).eq('id', id)
    } catch (_) {}

    return res.json({ success: true, data: updated })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

export async function deleteDriver(req, res) {
  try {
    const { id } = req.params
    const index = transitopsStore.drivers.findIndex(d => d.id === id)
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Driver not found' })
    }

    transitopsStore.drivers.splice(index, 1)

    try {
      await supabase.from('drivers').delete().eq('id', id)
    } catch (_) {}

    return res.json({ success: true, message: 'Driver removed successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
