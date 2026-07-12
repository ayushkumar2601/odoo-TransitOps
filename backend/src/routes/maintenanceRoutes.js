import { Router } from 'express'
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog
} from '../controllers/maintenanceController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/maintenance', requireRole(PERMISSIONS.MAINTENANCE_READ), getMaintenanceLogs)
router.post('/maintenance', requireRole(PERMISSIONS.MAINTENANCE_WRITE), createMaintenanceLog)
router.post('/maintenance/:id/close', requireRole(PERMISSIONS.MAINTENANCE_WRITE), closeMaintenanceLog)
router.put('/maintenance/:id/close', requireRole(PERMISSIONS.MAINTENANCE_WRITE), closeMaintenanceLog)

export default router
