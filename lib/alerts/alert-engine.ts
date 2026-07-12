import { store } from '@/lib/mock'
import { getStoredVehicleDocuments } from '@/lib/mock/vehicle-documents'

export interface SmartAlert {
  id: string
  title: string
  description: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  category: 'License' | 'Maintenance' | 'Utilization' | 'Cost'
  createdAt: string
  actionLink?: string
}

export function generateSmartAlerts(): SmartAlert[] {
  const alerts: SmartAlert[] = []
  const today = new Date().toISOString().split('T')[0]
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // 1. License Alerts
  store.drivers.forEach((drv) => {
    const exp = drv.expiryDate
    const diffTime = new Date(exp).getTime() - new Date(today).getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      alerts.push({
        id: `ALT-LIC-EXP-${drv.id}`,
        title: `BR-004 Locked: Expired Driver License (${drv.name})`,
        description: `Commercial driving license ${drv.licenseNumber} expired on ${drv.expiryDate}. Driver is locked from trip assignment.`,
        severity: 'Critical',
        category: 'License',
        createdAt: nowStr,
        actionLink: '/drivers'
      })
    } else if (diffDays <= 7) {
      alerts.push({
        id: `ALT-LIC-7D-${drv.id}`,
        title: `Urgent License Renewal: ${drv.name} (Expiring in ${diffDays} days)`,
        description: `License ${drv.licenseNumber} expires on ${drv.expiryDate}. Schedule medical check and renewal immediately.`,
        severity: 'Critical',
        category: 'License',
        createdAt: nowStr,
        actionLink: '/drivers'
      })
    } else if (diffDays <= 14) {
      alerts.push({
        id: `ALT-LIC-14D-${drv.id}`,
        title: `License Expiring Soon: ${drv.name} (14-Day Warning)`,
        description: `License ${drv.licenseNumber} expires on ${drv.expiryDate}. Action required within 2 weeks.`,
        severity: 'High',
        category: 'License',
        createdAt: nowStr,
        actionLink: '/drivers'
      })
    } else if (diffDays <= 30) {
      alerts.push({
        id: `ALT-LIC-30D-${drv.id}`,
        title: `30-Day Expiry Notice: ${drv.name}`,
        description: `License ${drv.licenseNumber} expires on ${drv.expiryDate}. Add to Safety Officer audit queue.`,
        severity: 'Medium',
        category: 'License',
        createdAt: nowStr,
        actionLink: '/drivers'
      })
    }
  })

  // 2. Maintenance Alerts
  store.vehicles.forEach((veh) => {
    if (veh.odometer >= 150000) {
      alerts.push({
        id: `ALT-MNT-ODO-${veh.id}`,
        title: `High Mileage Overhaul Required (${veh.registrationNumber})`,
        description: `Asset odometer has reached ${veh.odometer.toLocaleString()} km. Heavy engine overhaul inspection recommended.`,
        severity: 'High',
        category: 'Maintenance',
        createdAt: nowStr,
        actionLink: '/maintenance'
      })
    }

    if (veh.status === 'In Shop') {
      alerts.push({
        id: `ALT-MNT-SHOP-${veh.id}`,
        title: `BR-012 Active Workshop Lock: ${veh.registrationNumber}`,
        description: `Vehicle is currently undergoing maintenance and is locked from dispatch selection pool.`,
        severity: 'Medium',
        category: 'Maintenance',
        createdAt: nowStr,
        actionLink: '/maintenance'
      })
    }
  })

  // Check open maintenance tickets
  const openMaint = store.maintenanceLogs.filter(m => m.status === 'Open')
  if (openMaint.length > 0) {
    alerts.push({
      id: `ALT-MNT-OPEN`,
      title: `${openMaint.length} Active Workshop Tickets Open`,
      description: `Pending repairs across Eastern India workshop hubs totaling ₹${openMaint.reduce((a,b)=>a+b.cost,0).toLocaleString()} estimated expenditure.`,
      severity: 'High',
      category: 'Maintenance',
      createdAt: nowStr,
      actionLink: '/maintenance'
    })
  }

  // 3. Cost Alerts
  const totalFuelCost = store.fuelLogs.reduce((a, b) => a + b.cost, 0)
  const totalMaintCost = store.maintenanceLogs.reduce((a, b) => a + b.cost, 0)

  if (totalMaintCost > 200000) {
    alerts.push({
      id: 'ALT-CST-MAINT',
      title: 'Workshop Expense Spike Detected',
      description: `Total fleet maintenance expenditure reached ₹${totalMaintCost.toLocaleString()}, exceeding standard monthly budget buffer.`,
      severity: 'High',
      category: 'Cost',
      createdAt: nowStr,
      actionLink: '/expenses'
    })
  }

  // 4. Utilization Alerts
  const activeTripsCount = store.trips.filter(t => t.status === 'Dispatched').length
  const availableVehiclesCount = store.vehicles.filter(v => v.status === 'Available').length

  if (availableVehiclesCount > 10) {
    alerts.push({
      id: 'ALT-UTL-IDLE',
      title: `${availableVehiclesCount} Available Vehicles Ready for Haulage`,
      description: `High idle capacity across regional hubs. Dispatch pending draft trips to optimize fleet yield.`,
      severity: 'Low',
      category: 'Utilization',
      createdAt: nowStr,
      actionLink: '/trips'
    })
  }

  // 5. Vehicle Document Expiry Alerts (Phase 1.6 Odoo PRD)
  try {
    const docs = getStoredVehicleDocuments()
    docs.forEach(doc => {
      if (doc.status === 'Expired') {
        alerts.push({
          id: `ALT-DOC-EXP-${doc.id}`,
          title: `EXPIRED DOCUMENT: ${doc.vehicleRegistration} (${doc.documentType})`,
          description: `Document #${doc.documentNumber} expired on ${doc.expiryDate}. Immediate RTO compliance renewal required.`,
          severity: 'Critical',
          category: 'License',
          createdAt: nowStr,
          actionLink: '/vehicle-documents'
        })
      } else if (doc.status === 'Expiring Soon') {
        alerts.push({
          id: `ALT-DOC-SOON-${doc.id}`,
          title: `Document Expiring Soon: ${doc.vehicleRegistration} (${doc.documentType})`,
          description: `Document #${doc.documentNumber} expires on ${doc.expiryDate}. Schedule renewal with issuing authority.`,
          severity: 'High',
          category: 'License',
          createdAt: nowStr,
          actionLink: '/vehicle-documents'
        })
      }
    })
  } catch (e) {
    // Fallback if document module uninitialized
  }

  // Sort by severity order: Critical -> High -> Medium -> Low
  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return alerts
}
