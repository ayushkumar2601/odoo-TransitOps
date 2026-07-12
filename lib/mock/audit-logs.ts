export interface AuditLogRecord {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  category: 'Security & BR' | 'Dispatch' | 'Asset Mgmt' | 'System'
  details: string
  severity: 'Info' | 'Warning' | 'Critical'
}

const STORAGE_KEY = 'transitops_audit_logs_v1_6'

export const SEED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'AUD-9941',
    timestamp: '2026-07-12 08:45:10',
    user: 'Priya Chatterjee',
    role: 'Safety Officer',
    action: 'BR-004 Enforcement Lock',
    category: 'Security & BR',
    details: 'Locked driver Arindam Sen from dispatch queue due to expired commercial driving license.',
    severity: 'Critical'
  },
  {
    id: 'AUD-9940',
    timestamp: '2026-07-12 08:40:02',
    user: 'System Automated Engine',
    role: 'System',
    action: 'Outbound Reminder Notification',
    category: 'System',
    details: 'Dispatched automated license expiry notice to safety@transitops.io for 2 drivers.',
    severity: 'Warning'
  },
  {
    id: 'AUD-9939',
    timestamp: '2026-07-12 08:35:19',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'Vehicle Document Uploaded',
    category: 'Asset Mgmt',
    details: 'Uploaded verified digital scan RC_WB25P9001.pdf for asset WB-25-P-9001.',
    severity: 'Info'
  },
  {
    id: 'AUD-9938',
    timestamp: '2026-07-12 08:30:00',
    user: 'Rohan Sengupta',
    role: 'Dispatcher',
    action: 'Haulage Trip Dispatch (BR-009)',
    category: 'Dispatch',
    details: 'Dispatched Trip TRP-9001 (Kolkata -> Siliguri). Checked driver HOS and vehicle capacity.',
    severity: 'Info'
  },
  {
    id: 'AUD-9937',
    timestamp: '2026-07-12 08:15:44',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'Workshop Lock Activated (BR-012)',
    category: 'Security & BR',
    details: 'Locked asset WB-23-A-7741 In Shop for brake overhaul. Blocked from active haulage selection.',
    severity: 'Warning'
  },
  {
    id: 'AUD-9936',
    timestamp: '2026-07-11 19:20:10',
    user: 'Sneha Ghosh',
    role: 'Financial Analyst',
    action: 'Expense Log Approval',
    category: 'Asset Mgmt',
    details: 'Approved quarterly toll and fuel expense voucher batch totaling ₹148,900.',
    severity: 'Info'
  },
  {
    id: 'AUD-9935',
    timestamp: '2026-07-11 18:00:00',
    user: 'System Automated Engine',
    role: 'System',
    action: 'Maintenance Interval Threshold Reached',
    category: 'System',
    details: 'Generated Smart Alert ALT-MNT-WB04 for asset WB-04-E-1042 crossing 168,000 km.',
    severity: 'Warning'
  },
  {
    id: 'AUD-9934',
    timestamp: '2026-07-11 16:45:12',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'Vehicle Asset Registration',
    category: 'Asset Mgmt',
    details: 'Registered container asset WB-25-P-9001 under Kolkata hub.',
    severity: 'Info'
  },
  {
    id: 'AUD-9933',
    timestamp: '2026-07-11 15:10:00',
    user: 'Rohan Sengupta',
    role: 'Dispatcher',
    action: 'Trip Completion Verified',
    category: 'Dispatch',
    details: 'Marked Trip TRP-8812 Delivered at Guwahati terminal. Proof of Delivery verified.',
    severity: 'Info'
  },
  {
    id: 'AUD-9932',
    timestamp: '2026-07-11 14:00:00',
    user: 'Priya Chatterjee',
    role: 'Safety Officer',
    action: 'Driver Safety Score Adjustment',
    category: 'Security & BR',
    details: 'Adjusted safety score for Rajesh Roy to 94/100 following quarterly telemetry audit.',
    severity: 'Info'
  },
  {
    id: 'AUD-9931',
    timestamp: '2026-07-11 11:30:00',
    user: 'System Automated Engine',
    role: 'System',
    action: 'PUC Document Expiry Alert',
    category: 'Security & BR',
    details: 'Flagged expired PUC certificate for WB-04-E-1042.',
    severity: 'Critical'
  },
  {
    id: 'AUD-9930',
    timestamp: '2026-07-10 17:00:00',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'Fuel Fill Logged',
    category: 'Asset Mgmt',
    details: 'Logged 240 Liters diesel fill at IOCL Highway Plaza Kolkata for WB-25-P-9001.',
    severity: 'Info'
  },
  {
    id: 'AUD-9929',
    timestamp: '2026-07-10 14:20:00',
    user: 'Rohan Sengupta',
    role: 'Dispatcher',
    action: 'Route Corridor Optimization',
    category: 'Dispatch',
    details: 'Updated route corridor for TRP-9004 via NH-19 to avoid flood detour.',
    severity: 'Info'
  },
  {
    id: 'AUD-9928',
    timestamp: '2026-07-10 12:00:00',
    user: 'Priya Chatterjee',
    role: 'Safety Officer',
    action: 'Driver Medical Certificate Verified',
    category: 'Security & BR',
    details: 'Verified commercial medical clearance certificate for Amit Das.',
    severity: 'Info'
  },
  {
    id: 'AUD-9927',
    timestamp: '2026-07-09 16:15:00',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'Insurance Document Renewal',
    category: 'Asset Mgmt',
    details: 'Updated ICICI Lombard commercial insurance policy for OD-02-Q-1198.',
    severity: 'Info'
  },
  {
    id: 'AUD-9926',
    timestamp: '2026-07-09 11:00:00',
    user: 'System Automated Engine',
    role: 'System',
    action: 'Fleet Utilization Metric Check',
    category: 'System',
    details: 'Calculated daily fleet yield at 78.4% across 25 commercial vehicles.',
    severity: 'Info'
  },
  {
    id: 'AUD-9925',
    timestamp: '2026-07-08 15:40:00',
    user: 'Rohan Sengupta',
    role: 'Dispatcher',
    action: 'Trip Manifest Drafted',
    category: 'Dispatch',
    details: 'Drafted trip manifest TRP-9010 for Howrah jute haulage.',
    severity: 'Info'
  },
  {
    id: 'AUD-9924',
    timestamp: '2026-07-08 10:00:00',
    user: 'Sneha Ghosh',
    role: 'Financial Analyst',
    action: 'Acquisition Asset Valuation',
    category: 'Asset Mgmt',
    details: 'Logged depreciation schedule for 4 refrigerated commercial transport vehicles.',
    severity: 'Info'
  },
  {
    id: 'AUD-9923',
    timestamp: '2026-07-07 18:30:00',
    user: 'Aditya Banerjee',
    role: 'Fleet Manager',
    action: 'National Permit Verification',
    category: 'Security & BR',
    details: 'Verified interstate haulage permit compliance for Eastern India corridor.',
    severity: 'Info'
  },
  {
    id: 'AUD-9922',
    timestamp: '2026-07-07 14:00:00',
    user: 'System Automated Engine',
    role: 'System',
    action: 'System Database Checkpoint',
    category: 'System',
    details: 'Synchronized local persistent cache with mock data layer.',
    severity: 'Info'
  }
]

export function getStoredAuditLogs(): AuditLogRecord[] {
  if (typeof window === 'undefined') return SEED_AUDIT_LOGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AUDIT_LOGS))
      return SEED_AUDIT_LOGS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_AUDIT_LOGS
  }
}

export function logAuditEvent(entry: Omit<AuditLogRecord, 'id' | 'timestamp'>): AuditLogRecord {
  const list = getStoredAuditLogs()
  const now = new Date()
  const ts = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`
  const rec: AuditLogRecord = {
    ...entry,
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: ts
  }
  const updated = [rec, ...list]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
  return rec
}
