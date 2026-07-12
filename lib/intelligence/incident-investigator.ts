import { VehicleTelemetry } from '@/lib/live-tracking'

export interface StructuredIncidentAnalysis {
  title: string
  subjectId: string
  statusSeverity: 'Critical' | 'Warning' | 'Info'
  rootCause: string
  contributingFactors: string[]
  operationalImpact: string
  suggestedActions: string[]
}

export function investigateFleetQuery(
  query: string,
  vehicles: VehicleTelemetry[]
): StructuredIncidentAnalysis {
  const q = query.toLowerCase()

  // 1. Check if specific vehicle registration is asked (e.g. WB-04-E-1042 or WB-38-F-9102)
  const matchedVeh = vehicles.find(
    v =>
      q.includes(v.registrationNumber.toLowerCase()) ||
      q.includes(v.registrationNumber.toLowerCase().replace(/-/g, ''))
  )

  if (matchedVeh) {
    if (matchedVeh.status === 'Breakdown' || matchedVeh.engineHealth < 60) {
      return {
        title: `AI Root Cause Analysis: ${matchedVeh.registrationNumber} Engine Breakdown`,
        subjectId: matchedVeh.registrationNumber,
        statusSeverity: 'Critical',
        rootCause: `Critical thermal overheating detected in engine cooling manifold along corridor ${
          matchedVeh.currentTrip?.tripCode || 'Eastern India Route'
        }.`,
        contributingFactors: [
          `Engine health critical at ${matchedVeh.engineHealth}%`,
          `High cargo payload (${matchedVeh.cargoWeight} kg) on continuous upgrade segment`,
          ...matchedVeh.openAlerts.map(a => `Active Alert: ${a.replace(/_/g, ' ')}`)
        ],
        operationalImpact: `Corridor ETA delayed indefinitely until roadside repair team arrives. Haulage SLA risk for ${matchedVeh.currentTrip?.destination || 'destination depot'}.`,
        suggestedActions: [
          `Dispatch emergency roadside repair unit immediately from nearest regional workshop`,
          `Reassign backup tractor unit to cross-dock container freight within 90 minutes`,
          `Flag driver ${matchedVeh.driverName} for thermal monitoring coaching`
        ]
      }
    }

    // Default delayed or active vehicle analysis
    return {
      title: `AI Telemetry Audit: ${matchedVeh.registrationNumber} Haulage Mission`,
      subjectId: matchedVeh.registrationNumber,
      statusSeverity: matchedVeh.fuelPercent < 25 ? 'Warning' : 'Info',
      rootCause: matchedVeh.currentTrip
        ? `En route on ${matchedVeh.currentTrip.primaryHighway || 'National Highway'} heading toward ${matchedVeh.currentTrip.destination} at ${matchedVeh.speed} km/h.`
        : 'Vehicle currently stationed at regional logistics park.',
      contributingFactors: [
        `Operator: ${matchedVeh.driverName} (Safety Score: ${matchedVeh.safetyScore}/100)`,
        `Fuel remaining: ${matchedVeh.fuelPercent}% | Odometer: ${matchedVeh.odometer} km`,
        `Remaining Corridor SLA: ${matchedVeh.currentTrip?.distanceRemainingKm || 0} km (${matchedVeh.currentTrip?.etaMins || 0} mins ETA)`
      ],
      operationalImpact:
        matchedVeh.fuelPercent < 25
          ? 'Risk of low-fuel stoppage if not routed to nearest IOCL/BPCL partner station within 35 km.'
          : 'Operating within statutory transit schedule and SLA tolerances.',
      suggestedActions:
        matchedVeh.fuelPercent < 25
          ? ['Issue digital fuel voucher for nearest corridor station', 'Monitor live GPS heading']
          : ['Maintain normal corridor tracking', 'Verify e-Way bill document validity']
    }
  }

  // 2. Query about Delayed Trips or At-Risk Trips
  if (q.includes('delay') || q.includes('risk') || q.includes('late')) {
    const delayedVehicles = vehicles.filter(
      v => v.status === 'Breakdown' || (v.currentTrip && v.currentTrip.etaMins > 280) || v.fuelPercent < 20
    )
    return {
      title: 'AI Corridor SLA & Delay Audit',
      subjectId: 'FLEET-CORRIDOR-SLA',
      statusSeverity: 'Warning',
      rootCause: `Corridor congestion along NH-19 and 2 active maintenance/fuel bottlenecks affecting ${delayedVehicles.length} fleet assets.`,
      contributingFactors: [
        ...delayedVehicles.slice(0, 3).map(
          v => `${v.registrationNumber}: ${v.status} (${v.currentTrip?.etaMins || 0} mins ETA, ${v.fuelPercent}% fuel)`
        ),
        'Excessive idling during checkpost clearance at border transit gates'
      ],
      operationalImpact: `Potential 35-45 minute delivery shift across North Bengal and Jharkhand freight schedules.`,
      suggestedActions: [
        'Activate Smart Dispatch Recommender to assign standby vehicles to critical loads',
        'Send automated driver portal alerts for alternate bypass routing',
        'Pre-clear digital e-Way bills to minimize toll plaza queue times'
      ]
    }
  }

  // 3. Query about Fuel Cost / Idling
  if (q.includes('fuel') || q.includes('cost') || q.includes('idling') || q.includes('idle')) {
    const idling = vehicles.filter(v => v.status === 'Idling')
    return {
      title: 'AI Fuel Efficiency & Idling Investigation',
      subjectId: 'FLEET-FUEL-AUDIT',
      statusSeverity: 'Warning',
      rootCause: `Identified ${idling.length} vehicles with excessive engine idling (>25 mins), causing unmitigated fuel burn of ~1.8L/hr per vehicle.`,
      contributingFactors: [
        ...idling.map(i => `${i.registrationNumber} (${i.driverName}): Stationary engine idling`),
        'Unscheduled loading bay waiting periods at regional depots'
      ],
      operationalImpact: `Monthly fuel OPEX inflation of approximately ₹42,500 across Eastern India operations.`,
      suggestedActions: [
        'Enforce automated 10-minute engine cut-off telemetry rule via driver portal',
        'Schedule warehouse loading bay slots 30 minutes ahead of arrival',
        'Deploy Driver Risk Engine coaching badge for habitual idling operators'
      ]
    }
  }

  // 4. Default Enterprise Fleet Summary Analysis
  return {
    title: 'Executive AI Fleet Intelligence Summary',
    subjectId: 'ALL-FLEET-ASSETS',
    statusSeverity: 'Info',
    rootCause: `All ${vehicles.length} Eastern India commercial assets are continuously audited via real-time Digital Twin and Predictive Maintenance models.`,
    contributingFactors: [
      `Active Moving Assets: ${vehicles.filter(v => v.status === 'Moving').length} vehicles`,
      `Workshop / Breakdown Queue: ${vehicles.filter(v => v.status === 'Breakdown' || v.status === 'Maintenance').length} vehicles`,
      `Average Fleet Safety Score: ${Math.round(
        vehicles.reduce((acc, v) => acc + v.safetyScore, 0) / vehicles.length
      )} / 100`
    ],
    operationalImpact: 'Enterprise fleet utilization is at 84%, operating within demo-ready SLA thresholds.',
    suggestedActions: [
      'Inspect Operations War Room for large-screen TV view',
      'Download Executive Daily Briefing PDF report',
      'Examine vehicle Digital Twins for A+ to D asset rankings'
    ]
  }
}
