import { supabase } from '../config/supabase.js'
import { transitopsStore } from '../utils/transitopsStore.js'
import { BusinessRules } from '../utils/businessRules.js'

export async function getMaintenanceLogs(req, res) {
  try {
    const { status, vehicle_id } = req.query
    let list = [...transitopsStore.maintenance_logs]

    try {
      const { data, error } = await supabase.from('maintenance_logs').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (status && status !== 'All') {
      list = list.filter(m => m.status === status)
    }
    if (vehicle_id) {
      list = list.filter(m => m.vehicle_id === vehicle_id)
    }

    const enriched = list.map(m => {
      const vehicle = transitopsStore.vehicles.find(v => v.id === m.vehicle_id)
      return { ...m, vehicle }
    })

    return res.json({ success: true, data: enriched })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createMaintenanceLog(req, res) {
  try {
    const { vehicle_id, maintenance_type, description, cost } = req.body

    const vehicle = transitopsStore.vehicles.find(v => v.id === vehicle_id)
    if (!vehicle) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle_id' })
    }

    const newLog = {
      id: `m-${Date.now()}`,
      vehicle_id,
      maintenance_type,
      description,
      cost: Number(cost || 0),
      start_date: new Date().toISOString(),
      end_date: null,
      status: 'Open'
    }

    // BR-012: Vehicle -> In Shop
    BusinessRules.applyMaintenanceCreation(vehicle)

    // Log corresponding expense automatically
    if (newLog.cost > 0) {
      transitopsStore.expenses.unshift({
        id: `e-m-${Date.now()}`,
        vehicle_id,
        category: 'Maintenance',
        amount: newLog.cost,
        notes: `${maintenance_type}: ${description || ''}`,
        expense_date: new Date().toISOString()
      })
    }

    try {
      await supabase.from('maintenance_logs').insert([newLog])
      await supabase.from('vehicles').update({ status: 'In Shop' }).eq('id', vehicle_id)
    } catch (_) {}

    transitopsStore.maintenance_logs.unshift(newLog)

    return res.status(201).json({
      success: true,
      message: 'Maintenance ticket created and vehicle transitioned to In Shop under BR-012.',
      data: newLog
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

/**
 * Close Maintenance (BR-013)
 */
export async function closeMaintenanceLog(req, res) {
  try {
    const { id } = req.params
    const log = transitopsStore.maintenance_logs.find(m => m.id === id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Maintenance log not found' })
    }

    log.status = 'Closed'
    log.end_date = new Date().toISOString()

    const vehicle = transitopsStore.vehicles.find(v => v.id === log.vehicle_id)
    if (vehicle) {
      BusinessRules.applyMaintenanceClosure(vehicle)
    }

    try {
      await supabase.from('maintenance_logs').update({ status: 'Closed', end_date: log.end_date }).eq('id', id)
      if (vehicle && vehicle.status === 'Available') {
        await supabase.from('vehicles').update({ status: 'Available' }).eq('id', vehicle.id)
      }
    } catch (_) {}

    return res.json({
      success: true,
      message: 'Maintenance closed and vehicle returned to Available under BR-013.',
      data: log
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}
