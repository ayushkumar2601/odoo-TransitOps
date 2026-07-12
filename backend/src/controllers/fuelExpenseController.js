import { supabase } from '../config/supabase.js'
import { transitopsStore } from '../utils/transitopsStore.js'

export async function getFuelLogs(req, res) {
  try {
    const { vehicle_id } = req.query
    let list = [...transitopsStore.fuel_logs]

    try {
      const { data, error } = await supabase.from('fuel_logs').select('*').order('date', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (vehicle_id) {
      list = list.filter(f => f.vehicle_id === vehicle_id)
    }

    const enriched = list.map(f => {
      const vehicle = transitopsStore.vehicles.find(v => v.id === f.vehicle_id)
      const trip = transitopsStore.trips.find(t => t.id === f.trip_id)
      const distance = trip ? (Number(trip.actual_distance || trip.planned_distance || 0)) : 0
      const efficiency = Number(f.liters) > 0 ? Number((distance / Number(f.liters)).toFixed(2)) : 0
      return { ...f, vehicle, trip, efficiency_km_per_l: efficiency }
    })

    return res.json({ success: true, data: enriched })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createFuelLog(req, res) {
  try {
    const { vehicle_id, trip_id, liters, cost, fuel_station, date } = req.body

    const newLog = {
      id: `f-${Date.now()}`,
      vehicle_id,
      trip_id: trip_id || null,
      liters: Number(liters || 0),
      cost: Number(cost || 0),
      fuel_station: fuel_station || 'Standard Fuel Station',
      date: date || new Date().toISOString()
    }

    // Simultaneously record in expenses
    transitopsStore.expenses.unshift({
      id: `e-f-${Date.now()}`,
      vehicle_id,
      category: 'Fuel',
      amount: newLog.cost,
      notes: `${newLog.liters}L refueling at ${newLog.fuel_station}`,
      expense_date: newLog.date
    })

    try {
      await supabase.from('fuel_logs').insert([newLog])
    } catch (_) {}

    transitopsStore.fuel_logs.unshift(newLog)
    return res.status(201).json({ success: true, data: newLog })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

export async function getExpenses(req, res) {
  try {
    const { vehicle_id, category } = req.query
    let list = [...transitopsStore.expenses]

    try {
      const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (_) {}

    if (vehicle_id) {
      list = list.filter(e => e.vehicle_id === vehicle_id)
    }
    if (category && category !== 'All') {
      list = list.filter(e => e.category === category)
    }

    const enriched = list.map(e => {
      const vehicle = transitopsStore.vehicles.find(v => v.id === e.vehicle_id)
      return { ...e, vehicle }
    })

    return res.json({ success: true, data: enriched })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function createExpense(req, res) {
  try {
    const { vehicle_id, category, amount, notes, expense_date } = req.body

    const newExpense = {
      id: `e-${Date.now()}`,
      vehicle_id,
      category,
      amount: Number(amount || 0),
      notes: notes || '',
      expense_date: expense_date || new Date().toISOString()
    }

    try {
      await supabase.from('expenses').insert([newExpense])
    } catch (_) {}

    transitopsStore.expenses.unshift(newExpense)
    return res.status(201).json({ success: true, data: newExpense })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
}
