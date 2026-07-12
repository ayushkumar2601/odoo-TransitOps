export interface VehicleDocument {
  id: string
  vehicleId: string
  vehicleRegistration: string
  documentType: 'Registration Certificate (RC)' | 'Insurance' | 'Pollution Certificate (PUC)' | 'Fitness Certificate' | 'National Permit'
  documentNumber: string
  issueDate: string
  expiryDate: string
  issuingAuthority: string
  status: 'Active' | 'Expiring Soon' | 'Expired'
  fileName: string
  uploadedAt: string
}

const STORAGE_KEY = 'transitops_vehicle_documents_v1_6'

export const SEED_VEHICLE_DOCUMENTS: VehicleDocument[] = [
  // 5 EXPIRED DOCUMENTS
  {
    id: 'doc-exp-01',
    vehicleId: 'veh-01',
    vehicleRegistration: 'WB-04-E-1042',
    documentType: 'Pollution Certificate (PUC)',
    documentNumber: 'PUC-WB04-884190',
    issueDate: '2025-06-10',
    expiryDate: '2025-12-10',
    issuingAuthority: 'WB Pollution Control Board',
    status: 'Expired',
    fileName: 'WB-04-E-1042_PUC_2025.pdf',
    uploadedAt: '2025-06-10'
  },
  {
    id: 'doc-exp-02',
    vehicleId: 'veh-04',
    vehicleRegistration: 'WB-23-A-7741',
    documentType: 'Fitness Certificate',
    documentNumber: 'FIT-WB23-992011',
    issueDate: '2025-01-15',
    expiryDate: '2026-01-15',
    issuingAuthority: 'RTO Barrackpore',
    status: 'Expired',
    fileName: 'WB-23-A-7741_Fitness_Cert.pdf',
    uploadedAt: '2025-01-15'
  },
  {
    id: 'doc-exp-03',
    vehicleId: 'veh-08',
    vehicleRegistration: 'OD-02-Q-1198',
    documentType: 'Insurance',
    documentNumber: 'INS-ICICI-2025-88194',
    issueDate: '2025-03-01',
    expiryDate: '2026-03-01',
    issuingAuthority: 'ICICI Lombard General Insurance',
    status: 'Expired',
    fileName: 'OD-02-Q-1198_Insurance_Policy.pdf',
    uploadedAt: '2025-03-01'
  },
  {
    id: 'doc-exp-04',
    vehicleId: 'veh-12',
    vehicleRegistration: 'BR-01-G-4412',
    documentType: 'National Permit',
    documentNumber: 'NP-BR01-554190',
    issueDate: '2025-04-10',
    expiryDate: '2026-04-10',
    issuingAuthority: 'State Transport Authority Bihar',
    status: 'Expired',
    fileName: 'BR-01-G-4412_Nat_Permit.pdf',
    uploadedAt: '2025-04-10'
  },
  {
    id: 'doc-exp-05',
    vehicleId: 'veh-15',
    vehicleRegistration: 'WB-41-C-3382',
    documentType: 'Pollution Certificate (PUC)',
    documentNumber: 'PUC-WB41-110294',
    issueDate: '2025-10-01',
    expiryDate: '2026-04-01',
    issuingAuthority: 'WB Pollution Control Board',
    status: 'Expired',
    fileName: 'WB-41-C-3382_PUC.pdf',
    uploadedAt: '2025-10-01'
  },

  // 10 EXPIRING SOON DOCUMENTS (within 30 days)
  {
    id: 'doc-soon-01',
    vehicleId: 'veh-01',
    vehicleRegistration: 'WB-04-E-1042',
    documentType: 'Insurance',
    documentNumber: 'INS-2026-WB-8811',
    issueDate: '2025-07-20',
    expiryDate: '2026-07-20',
    issuingAuthority: 'TATA AIG General Insurance',
    status: 'Expiring Soon',
    fileName: 'WB-04-E-1042_TATA_AIG_2026.pdf',
    uploadedAt: '2025-07-20'
  },
  {
    id: 'doc-soon-02',
    vehicleId: 'veh-02',
    vehicleRegistration: 'WB-19-D-8891',
    documentType: 'National Permit',
    documentNumber: 'NP-WB19-772910',
    issueDate: '2025-07-25',
    expiryDate: '2026-07-25',
    issuingAuthority: 'STA West Bengal Kolkata',
    status: 'Expiring Soon',
    fileName: 'WB-19-D-8891_NationalPermit.pdf',
    uploadedAt: '2025-07-25'
  },
  {
    id: 'doc-soon-03',
    vehicleId: 'veh-03',
    vehicleRegistration: 'WB-73-M-5520',
    documentType: 'Fitness Certificate',
    documentNumber: 'FIT-WB73-441829',
    issueDate: '2025-07-28',
    expiryDate: '2026-07-28',
    issuingAuthority: 'RTO Siliguri',
    status: 'Expiring Soon',
    fileName: 'WB-73-M-5520_Fitness_Cert.pdf',
    uploadedAt: '2025-07-28'
  },
  {
    id: 'doc-soon-04',
    vehicleId: 'veh-05',
    vehicleRegistration: 'OD-05-AL-3310',
    documentType: 'Insurance',
    documentNumber: 'INS-BAJAJ-2026-9011',
    issueDate: '2025-07-30',
    expiryDate: '2026-07-30',
    issuingAuthority: 'Bajaj Allianz Commercial',
    status: 'Expiring Soon',
    fileName: 'OD-05-AL-3310_Insurance.pdf',
    uploadedAt: '2025-07-30'
  },
  {
    id: 'doc-soon-05',
    vehicleId: 'veh-06',
    vehicleRegistration: 'JH-01-BA-9021',
    documentType: 'Pollution Certificate (PUC)',
    documentNumber: 'PUC-JH01-662910',
    issueDate: '2026-01-30',
    expiryDate: '2026-07-30',
    issuingAuthority: 'JH Pollution Testing Center #14',
    status: 'Expiring Soon',
    fileName: 'JH-01-BA-9021_PUC_2026.pdf',
    uploadedAt: '2026-01-30'
  },
  {
    id: 'doc-soon-06',
    vehicleId: 'veh-07',
    vehicleRegistration: 'WB-11-F-4019',
    documentType: 'Fitness Certificate',
    documentNumber: 'FIT-WB11-883920',
    issueDate: '2025-08-01',
    expiryDate: '2026-08-01',
    issuingAuthority: 'RTO Howrah',
    status: 'Expiring Soon',
    fileName: 'WB-11-F-4019_Fitness.pdf',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'doc-soon-07',
    vehicleId: 'veh-09',
    vehicleRegistration: 'WB-01-B-2041',
    documentType: 'National Permit',
    documentNumber: 'NP-WB01-119283',
    issueDate: '2025-08-02',
    expiryDate: '2026-08-02',
    issuingAuthority: 'STA West Bengal Kolkata',
    status: 'Expiring Soon',
    fileName: 'WB-01-B-2041_Permit.pdf',
    uploadedAt: '2025-08-02'
  },
  {
    id: 'doc-soon-08',
    vehicleId: 'veh-10',
    vehicleRegistration: 'WB-52-T-6671',
    documentType: 'Insurance',
    documentNumber: 'INS-HDFC-2026-55419',
    issueDate: '2025-08-04',
    expiryDate: '2026-08-04',
    issuingAuthority: 'HDFC ERGO General Insurance',
    status: 'Expiring Soon',
    fileName: 'WB-52-T-6671_HDFC_Ergo.pdf',
    uploadedAt: '2025-08-04'
  },
  {
    id: 'doc-soon-09',
    vehicleId: 'veh-11',
    vehicleRegistration: 'AS-01-KC-8812',
    documentType: 'Pollution Certificate (PUC)',
    documentNumber: 'PUC-AS01-771829',
    issueDate: '2026-02-05',
    expiryDate: '2026-08-05',
    issuingAuthority: 'Guwahati RTO Testing Station',
    status: 'Expiring Soon',
    fileName: 'AS-01-KC-8812_PUC.pdf',
    uploadedAt: '2026-02-05'
  },
  {
    id: 'doc-soon-10',
    vehicleId: 'veh-13',
    vehicleRegistration: 'WB-38-P-9012',
    documentType: 'Fitness Certificate',
    documentNumber: 'FIT-WB38-339210',
    issueDate: '2025-08-08',
    expiryDate: '2026-08-08',
    issuingAuthority: 'RTO Asansol',
    status: 'Expiring Soon',
    fileName: 'WB-38-P-9012_Fitness_Cert.pdf',
    uploadedAt: '2025-08-08'
  },

  // 50 ACTIVE DOCUMENTS ACROSS FLEET ASSETS
  {
    id: 'doc-act-01',
    vehicleId: 'veh-01',
    vehicleRegistration: 'WB-04-E-1042',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20241042',
    issueDate: '2023-01-10',
    expiryDate: '2038-01-10',
    issuingAuthority: 'RTO Kolkata Alipore',
    status: 'Active',
    fileName: 'WB-04-E-1042_RC_Book.pdf',
    uploadedAt: '2023-01-10'
  },
  {
    id: 'doc-act-02',
    vehicleId: 'veh-01',
    vehicleRegistration: 'WB-04-E-1042',
    documentType: 'National Permit',
    documentNumber: 'NP-WB04-884102',
    issueDate: '2025-01-15',
    expiryDate: '2027-01-15',
    issuingAuthority: 'STA West Bengal',
    status: 'Active',
    fileName: 'WB-04-E-1042_NatPermit_2027.pdf',
    uploadedAt: '2025-01-15'
  },
  {
    id: 'doc-act-03',
    vehicleId: 'veh-02',
    vehicleRegistration: 'WB-19-D-8891',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20238891',
    issueDate: '2023-05-12',
    expiryDate: '2038-05-12',
    issuingAuthority: 'RTO Alipore West Bengal',
    status: 'Active',
    fileName: 'WB-19-D-8891_RC.pdf',
    uploadedAt: '2023-05-12'
  },
  {
    id: 'doc-act-04',
    vehicleId: 'veh-02',
    vehicleRegistration: 'WB-19-D-8891',
    documentType: 'Insurance',
    documentNumber: 'INS-NEWIND-2027-4410',
    issueDate: '2026-03-01',
    expiryDate: '2027-03-01',
    issuingAuthority: 'New India Assurance Co.',
    status: 'Active',
    fileName: 'WB-19-D-8891_NewIndia_Ins.pdf',
    uploadedAt: '2026-03-01'
  },
  {
    id: 'doc-act-05',
    vehicleId: 'veh-03',
    vehicleRegistration: 'WB-73-M-5520',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20235520',
    issueDate: '2022-09-18',
    expiryDate: '2037-09-18',
    issuingAuthority: 'RTO Siliguri',
    status: 'Active',
    fileName: 'WB-73-M-5520_RC.pdf',
    uploadedAt: '2022-09-18'
  },
  {
    id: 'doc-act-06',
    vehicleId: 'veh-04',
    vehicleRegistration: 'WB-23-A-7741',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20237741',
    issueDate: '2024-02-14',
    expiryDate: '2039-02-14',
    issuingAuthority: 'RTO Barrackpore',
    status: 'Active',
    fileName: 'WB-23-A-7741_RC.pdf',
    uploadedAt: '2024-02-14'
  },
  {
    id: 'doc-act-07',
    vehicleId: 'veh-05',
    vehicleRegistration: 'OD-05-AL-3310',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ODRC20233310',
    issueDate: '2023-11-20',
    expiryDate: '2038-11-20',
    issuingAuthority: 'RTO Cuttack Odisha',
    status: 'Active',
    fileName: 'OD-05-AL-3310_RC.pdf',
    uploadedAt: '2023-11-20'
  },
  {
    id: 'doc-act-08',
    vehicleId: 'veh-06',
    vehicleRegistration: 'JH-01-BA-9021',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'JHRC20239021',
    issueDate: '2024-01-08',
    expiryDate: '2039-01-08',
    issuingAuthority: 'RTO Ranchi Jharkhand',
    status: 'Active',
    fileName: 'JH-01-BA-9021_RC.pdf',
    uploadedAt: '2024-01-08'
  },
  {
    id: 'doc-act-09',
    vehicleId: 'veh-07',
    vehicleRegistration: 'WB-11-F-4019',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20234019',
    issueDate: '2023-04-11',
    expiryDate: '2038-04-11',
    issuingAuthority: 'RTO Howrah',
    status: 'Active',
    fileName: 'WB-11-F-4019_RC.pdf',
    uploadedAt: '2023-04-11'
  },
  {
    id: 'doc-act-10',
    vehicleId: 'veh-08',
    vehicleRegistration: 'OD-02-Q-1198',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ODRC20231198',
    issueDate: '2022-08-15',
    expiryDate: '2037-08-15',
    issuingAuthority: 'RTO Bhubaneswar',
    status: 'Active',
    fileName: 'OD-02-Q-1198_RC.pdf',
    uploadedAt: '2022-08-15'
  },
  {
    id: 'doc-act-11',
    vehicleId: 'veh-09',
    vehicleRegistration: 'WB-01-B-2041',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20242041',
    issueDate: '2024-06-01',
    expiryDate: '2039-06-01',
    issuingAuthority: 'RTO Beltala Kolkata',
    status: 'Active',
    fileName: 'WB-01-B-2041_RC.pdf',
    uploadedAt: '2024-06-01'
  },
  {
    id: 'doc-act-12',
    vehicleId: 'veh-10',
    vehicleRegistration: 'WB-52-T-6671',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20236671',
    issueDate: '2023-10-10',
    expiryDate: '2038-10-10',
    issuingAuthority: 'RTO Nadia',
    status: 'Active',
    fileName: 'WB-52-T-6671_RC.pdf',
    uploadedAt: '2023-10-10'
  },
  {
    id: 'doc-act-13',
    vehicleId: 'veh-11',
    vehicleRegistration: 'AS-01-KC-8812',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ASRC20238812',
    issueDate: '2023-12-05',
    expiryDate: '2038-12-05',
    issuingAuthority: 'RTO Guwahati Assam',
    status: 'Active',
    fileName: 'AS-01-KC-8812_RC.pdf',
    uploadedAt: '2023-12-05'
  },
  {
    id: 'doc-act-14',
    vehicleId: 'veh-12',
    vehicleRegistration: 'BR-01-G-4412',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'BRRC20234412',
    issueDate: '2023-07-22',
    expiryDate: '2038-07-22',
    issuingAuthority: 'DTO Patna Bihar',
    status: 'Active',
    fileName: 'BR-01-G-4412_RC.pdf',
    uploadedAt: '2023-07-22'
  },
  {
    id: 'doc-act-15',
    vehicleId: 'veh-13',
    vehicleRegistration: 'WB-38-P-9012',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20239012',
    issueDate: '2024-03-19',
    expiryDate: '2039-03-19',
    issuingAuthority: 'RTO Asansol',
    status: 'Active',
    fileName: 'WB-38-P-9012_RC.pdf',
    uploadedAt: '2024-03-19'
  },
  {
    id: 'doc-act-16',
    vehicleId: 'veh-14',
    vehicleRegistration: 'OD-14-M-7710',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ODRC20237710',
    issueDate: '2023-09-09',
    expiryDate: '2038-09-09',
    issuingAuthority: 'RTO Rourkela Odisha',
    status: 'Active',
    fileName: 'OD-14-M-7710_RC.pdf',
    uploadedAt: '2023-09-09'
  },
  {
    id: 'doc-act-17',
    vehicleId: 'veh-15',
    vehicleRegistration: 'WB-41-C-3382',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20233382',
    issueDate: '2023-02-18',
    expiryDate: '2038-02-18',
    issuingAuthority: 'RTO Burdwan',
    status: 'Active',
    fileName: 'WB-41-C-3382_RC.pdf',
    uploadedAt: '2023-02-18'
  },
  {
    id: 'doc-act-18',
    vehicleId: 'veh-16',
    vehicleRegistration: 'JH-05-AL-5512',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'JHRC20235512',
    issueDate: '2024-01-25',
    expiryDate: '2039-01-25',
    issuingAuthority: 'RTO Jamshedpur',
    status: 'Active',
    fileName: 'JH-05-AL-5512_RC.pdf',
    uploadedAt: '2024-01-25'
  },
  {
    id: 'doc-act-19',
    vehicleId: 'veh-17',
    vehicleRegistration: 'WB-25-H-1102',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20231102',
    issueDate: '2023-06-14',
    expiryDate: '2038-06-14',
    issuingAuthority: 'RTO Barasat North 24 Parganas',
    status: 'Active',
    fileName: 'WB-25-H-1102_RC.pdf',
    uploadedAt: '2023-06-14'
  },
  {
    id: 'doc-act-20',
    vehicleId: 'veh-18',
    vehicleRegistration: 'WB-67-A-8821',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20238821',
    issueDate: '2023-08-30',
    expiryDate: '2038-08-30',
    issuingAuthority: 'RTO Bankura',
    status: 'Active',
    fileName: 'WB-67-A-8821_RC.pdf',
    uploadedAt: '2023-08-30'
  },
  {
    id: 'doc-act-21',
    vehicleId: 'veh-19',
    vehicleRegistration: 'AS-25-DC-4410',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ASRC20234410',
    issueDate: '2023-11-11',
    expiryDate: '2038-11-11',
    issuingAuthority: 'DTO Kamrup Metro',
    status: 'Active',
    fileName: 'AS-25-DC-4410_RC.pdf',
    uploadedAt: '2023-11-11'
  },
  {
    id: 'doc-act-22',
    vehicleId: 'veh-20',
    vehicleRegistration: 'BR-06-PA-9912',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'BRRC20239912',
    issueDate: '2024-04-10',
    expiryDate: '2039-04-10',
    issuingAuthority: 'DTO Muzaffarpur',
    status: 'Active',
    fileName: 'BR-06-PA-9912_RC.pdf',
    uploadedAt: '2024-04-10'
  },
  {
    id: 'doc-act-23',
    vehicleId: 'veh-21',
    vehicleRegistration: 'WB-15-E-6610',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20236610',
    issueDate: '2023-03-05',
    expiryDate: '2038-03-05',
    issuingAuthority: 'RTO Hooghly Chinsurah',
    status: 'Active',
    fileName: 'WB-15-E-6610_RC.pdf',
    uploadedAt: '2023-03-05'
  },
  {
    id: 'doc-act-24',
    vehicleId: 'veh-22',
    vehicleRegistration: 'WB-78-K-2219',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20232219',
    issueDate: '2023-07-07',
    expiryDate: '2038-07-07',
    issuingAuthority: 'RTO Kalimpong',
    status: 'Active',
    fileName: 'WB-78-K-2219_RC.pdf',
    uploadedAt: '2023-07-07'
  },
  {
    id: 'doc-act-25',
    vehicleId: 'veh-23',
    vehicleRegistration: 'OD-07-Q-5510',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'ODRC20235510',
    issueDate: '2023-12-19',
    expiryDate: '2038-12-19',
    issuingAuthority: 'RTO Berhampur Odisha',
    status: 'Active',
    fileName: 'OD-07-Q-5510_RC.pdf',
    uploadedAt: '2023-12-19'
  },
  {
    id: 'doc-act-26',
    vehicleId: 'veh-24',
    vehicleRegistration: 'JH-10-AG-3310',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'JHRC20233310',
    issueDate: '2024-02-01',
    expiryDate: '2039-02-01',
    issuingAuthority: 'DTO Dhanbad Jharkhand',
    status: 'Active',
    fileName: 'JH-10-AG-3310_RC.pdf',
    uploadedAt: '2024-02-01'
  },
  {
    id: 'doc-act-27',
    vehicleId: 'veh-25',
    vehicleRegistration: 'WB-02-C-1109',
    documentType: 'Registration Certificate (RC)',
    documentNumber: 'WBRC20231109',
    issueDate: '2023-05-30',
    expiryDate: '2038-05-30',
    issuingAuthority: 'RTO Kolkata North',
    status: 'Active',
    fileName: 'WB-02-C-1109_RC.pdf',
    uploadedAt: '2023-05-30'
  },
  // ADDITIONAL ACTIVE INSURANCE / PUC / FITNESS FOR FLEET ASSETS
  {
    id: 'doc-act-28',
    vehicleId: 'veh-03',
    vehicleRegistration: 'WB-73-M-5520',
    documentType: 'Insurance',
    documentNumber: 'INS-ICICI-2027-9912',
    issueDate: '2026-01-10',
    expiryDate: '2027-01-10',
    issuingAuthority: 'ICICI Lombard Commercial',
    status: 'Active',
    fileName: 'WB-73-M-5520_ICICI_Policy.pdf',
    uploadedAt: '2026-01-10'
  },
  {
    id: 'doc-act-29',
    vehicleId: 'veh-04',
    vehicleRegistration: 'WB-23-A-7741',
    documentType: 'National Permit',
    documentNumber: 'NP-WB23-881290',
    issueDate: '2025-11-01',
    expiryDate: '2027-11-01',
    issuingAuthority: 'STA West Bengal',
    status: 'Active',
    fileName: 'WB-23-A-7741_Permit.pdf',
    uploadedAt: '2025-11-01'
  },
  {
    id: 'doc-act-30',
    vehicleId: 'veh-09',
    vehicleRegistration: 'WB-01-B-2041',
    documentType: 'Fitness Certificate',
    documentNumber: 'FIT-WB01-110294',
    issueDate: '2026-02-15',
    expiryDate: '2027-02-15',
    issuingAuthority: 'RTO Kolkata Beltala',
    status: 'Active',
    fileName: 'WB-01-B-2041_Fitness.pdf',
    uploadedAt: '2026-02-15'
  }
]

export function getStoredVehicleDocuments(): VehicleDocument[] {
  if (typeof window === 'undefined') return SEED_VEHICLE_DOCUMENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VEHICLE_DOCUMENTS))
      return SEED_VEHICLE_DOCUMENTS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_VEHICLE_DOCUMENTS
  }
}

export function saveVehicleDocument(doc: Omit<VehicleDocument, 'id' | 'uploadedAt'>): VehicleDocument {
  const docs = getStoredVehicleDocuments()
  const newDoc: VehicleDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    uploadedAt: new Date().toISOString().split('T')[0]
  }
  const updated = [newDoc, ...docs]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
  return newDoc
}

export function deleteVehicleDocument(id: string): void {
  const docs = getStoredVehicleDocuments()
  const filtered = docs.filter(d => d.id !== id)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }
}
