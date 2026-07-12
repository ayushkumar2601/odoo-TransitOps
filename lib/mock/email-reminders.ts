export interface EmailReminderRecord {
  id: string
  recipient: string
  subject: string
  category: 'License Expiry' | 'Document Expiry' | 'Maintenance Due'
  timestamp: string
  status: 'Delivered (SMTP)' | 'Delivered (Demo Preview)'
  bodyPreview: string
  targetAssetOrPerson: string
}

const STORAGE_KEY = 'transitops_email_reminders_v1_6'

export const SEED_EMAIL_REMINDERS: EmailReminderRecord[] = [
  {
    id: 'eml-01',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Arindam Sen (WB-DL-2018-0912)',
    category: 'License Expiry',
    timestamp: '2026-07-12 08:30:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'CRITICAL: Driver Arindam Sen holds an expired commercial driving license. Locked under BR-004.',
    targetAssetOrPerson: 'Arindam Sen'
  },
  {
    id: 'eml-02',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Animesh Paul (WB-DL-2017-4412)',
    category: 'License Expiry',
    timestamp: '2026-07-12 08:31:12',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'CRITICAL: Driver Animesh Paul holds an expired commercial driving license. Locked under BR-004.',
    targetAssetOrPerson: 'Animesh Paul'
  },
  {
    id: 'eml-03',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-04-E-1042 (Pollution Certificate - PUC)',
    category: 'Document Expiry',
    timestamp: '2026-07-12 08:32:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'PUC Certificate #PUC-WB04-884190 expired. Immediate RTO emission certification renewal required.',
    targetAssetOrPerson: 'WB-04-E-1042'
  },
  {
    id: 'eml-04',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-23-A-7741 (Fitness Certificate)',
    category: 'Document Expiry',
    timestamp: '2026-07-12 08:33:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Fitness Certificate #FIT-WB23-992011 expired. Schedule RTO inspection immediately.',
    targetAssetOrPerson: 'WB-23-A-7741'
  },
  {
    id: 'eml-05',
    recipient: 'finance@transitops.io',
    subject: 'Vehicle Document Expiry Alert — OD-02-Q-1198 (Commercial Insurance Policy)',
    category: 'Document Expiry',
    timestamp: '2026-07-12 08:35:10',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Commercial Insurance #INS-ICICI-2025-88194 expired. Asset coverage lapsed.',
    targetAssetOrPerson: 'OD-02-Q-1198'
  },
  {
    id: 'eml-06',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — WB-04-E-1042 (Scheduled Mileage Interval reached)',
    category: 'Maintenance Due',
    timestamp: '2026-07-11 18:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Odometer reached 168,400 km. Heavy routine brake check and transmission inspection scheduled.',
    targetAssetOrPerson: 'WB-04-E-1042'
  },
  {
    id: 'eml-07',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — BR-01-G-4412 (National Permit)',
    category: 'Document Expiry',
    timestamp: '2026-07-11 16:30:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'National Permit #NP-BR01-554190 expired. Interstate haulage restricted.',
    targetAssetOrPerson: 'BR-01-G-4412'
  },
  {
    id: 'eml-08',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-41-C-3382 (Pollution Certificate - PUC)',
    category: 'Document Expiry',
    timestamp: '2026-07-11 15:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'PUC #PUC-WB41-110294 expired. Renewal due.',
    targetAssetOrPerson: 'WB-41-C-3382'
  },
  {
    id: 'eml-09',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Subrata Mukherjee (30-Day Expiry Warning)',
    category: 'License Expiry',
    timestamp: '2026-07-11 14:15:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Commercial HMV license expiring within 30 days. Medical renewal check advised.',
    targetAssetOrPerson: 'Subrata Mukherjee'
  },
  {
    id: 'eml-10',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Rajesh Roy (30-Day Expiry Warning)',
    category: 'License Expiry',
    timestamp: '2026-07-11 13:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'License expiring next month. Schedule renewal at regional DTO.',
    targetAssetOrPerson: 'Rajesh Roy'
  },
  {
    id: 'eml-11',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — WB-23-A-7741 (Workshop Service Ticket Open)',
    category: 'Maintenance Due',
    timestamp: '2026-07-10 11:20:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Asset currently In Shop under BR-012 Workshop Lock. Engine gasket service active.',
    targetAssetOrPerson: 'WB-23-A-7741'
  },
  {
    id: 'eml-12',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-19-D-8891 (National Permit Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-10 10:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'National Permit #NP-WB19-772910 expires on 2026-07-25. Renewal application recommended.',
    targetAssetOrPerson: 'WB-19-D-8891'
  },
  {
    id: 'eml-13',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-73-M-5520 (Fitness Certificate Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-10 09:15:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Fitness Certificate #FIT-WB73-441829 expires on 2026-07-28.',
    targetAssetOrPerson: 'WB-73-M-5520'
  },
  {
    id: 'eml-14',
    recipient: 'finance@transitops.io',
    subject: 'Vehicle Document Expiry Alert — OD-05-AL-3310 (Commercial Insurance Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-09 17:40:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Bajaj Allianz Commercial Policy expires on 2026-07-30.',
    targetAssetOrPerson: 'OD-05-AL-3310'
  },
  {
    id: 'eml-15',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — JH-01-BA-9021 (PUC Certificate Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-09 16:10:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Emission test PUC certificate expires on 2026-07-30.',
    targetAssetOrPerson: 'JH-01-BA-9021'
  },
  {
    id: 'eml-16',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — OD-02-Q-1198 (Clutch Plate Replacement Ticket)',
    category: 'Maintenance Due',
    timestamp: '2026-07-09 14:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Vehicle locked In Shop under BR-012 for clutch overhaul.',
    targetAssetOrPerson: 'OD-02-Q-1198'
  },
  {
    id: 'eml-17',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-11-F-4019 (Fitness Certificate Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-08 12:30:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Fitness Cert #FIT-WB11-883920 expires next month.',
    targetAssetOrPerson: 'WB-11-F-4019'
  },
  {
    id: 'eml-18',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-01-B-2041 (National Permit Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-08 11:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Permit #NP-WB01-119283 requires renewal.',
    targetAssetOrPerson: 'WB-01-B-2041'
  },
  {
    id: 'eml-19',
    recipient: 'finance@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-52-T-6671 (Insurance Policy Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-08 09:20:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'HDFC Ergo policy expires on 2026-08-04.',
    targetAssetOrPerson: 'WB-52-T-6671'
  },
  {
    id: 'eml-20',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — AS-01-KC-8812 (PUC Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-07 18:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'PUC #PUC-AS01-771829 expires on 2026-08-05.',
    targetAssetOrPerson: 'AS-01-KC-8812'
  },
  {
    id: 'eml-21',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Bikash Pradhan (60-Day Renewal Window)',
    category: 'License Expiry',
    timestamp: '2026-07-07 15:30:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'License renewal window active for commercial transport category.',
    targetAssetOrPerson: 'Bikash Pradhan'
  },
  {
    id: 'eml-22',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — BR-01-G-4412 (Workshop Service Required)',
    category: 'Maintenance Due',
    timestamp: '2026-07-07 14:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Asset currently In Shop under BR-012 Workshop Lock.',
    targetAssetOrPerson: 'BR-01-G-4412'
  },
  {
    id: 'eml-23',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-38-P-9012 (Fitness Cert Expiring Soon)',
    category: 'Document Expiry',
    timestamp: '2026-07-06 16:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Fitness Certificate due for annual renewal.',
    targetAssetOrPerson: 'WB-38-P-9012'
  },
  {
    id: 'eml-24',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Amit Das (Quarterly Audit Verification)',
    category: 'License Expiry',
    timestamp: '2026-07-06 11:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'License active through 2028. Compliance verified.',
    targetAssetOrPerson: 'Amit Das'
  },
  {
    id: 'eml-25',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — OD-14-M-7710 (Scheduled Oil & Filter Change)',
    category: 'Maintenance Due',
    timestamp: '2026-07-05 17:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Odometer reached 85,000 km interval.',
    targetAssetOrPerson: 'OD-14-M-7710'
  },
  {
    id: 'eml-26',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-41-C-3382 (Insurance Active)',
    category: 'Document Expiry',
    timestamp: '2026-07-05 12:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Policy verified active through 2027.',
    targetAssetOrPerson: 'WB-41-C-3382'
  },
  {
    id: 'eml-27',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — JH-05-AL-5512 (Tyre Tread Inspection)',
    category: 'Maintenance Due',
    timestamp: '2026-07-04 15:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Routine workshop inspection completed.',
    targetAssetOrPerson: 'JH-05-AL-5512'
  },
  {
    id: 'eml-28',
    recipient: 'safety@transitops.io',
    subject: 'Driver License Expiry Notice — Rahul Sharma (Safety Leader Compliance)',
    category: 'License Expiry',
    timestamp: '2026-07-04 10:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'License verified active. Safety Score 94/100.',
    targetAssetOrPerson: 'Rahul Sharma'
  },
  {
    id: 'eml-29',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Document Expiry Alert — WB-25-H-1102 (National Permit Verification)',
    category: 'Document Expiry',
    timestamp: '2026-07-03 16:00:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Permit valid through 2027.',
    targetAssetOrPerson: 'WB-25-H-1102'
  },
  {
    id: 'eml-30',
    recipient: 'fleet@transitops.io',
    subject: 'Vehicle Maintenance Due — WB-67-A-8821 (Annual Preventive Service)',
    category: 'Maintenance Due',
    timestamp: '2026-07-03 11:30:00',
    status: 'Delivered (Demo Preview)',
    bodyPreview: 'Preventive maintenance logged.',
    targetAssetOrPerson: 'WB-67-A-8821'
  }
]

export function getStoredEmailReminders(): EmailReminderRecord[] {
  if (typeof window === 'undefined') return SEED_EMAIL_REMINDERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EMAIL_REMINDERS))
      return SEED_EMAIL_REMINDERS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_EMAIL_REMINDERS
  }
}

export function logEmailReminder(rem: Omit<EmailReminderRecord, 'id' | 'timestamp'>): EmailReminderRecord {
  const list = getStoredEmailReminders()
  const now = new Date()
  const ts = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`
  const newRec: EmailReminderRecord = {
    ...rem,
    id: `eml-${Date.now()}`,
    timestamp: ts
  }
  const updated = [newRec, ...list]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
  return newRec
}
