import { Router } from 'express'
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} from '../controllers/driverController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/drivers', requireRole(PERMISSIONS.DRIVERS_READ), getDrivers)
router.get('/drivers/:id', requireRole(PERMISSIONS.DRIVERS_READ), getDriverById)
router.post('/drivers', requireRole(PERMISSIONS.DRIVERS_WRITE), createDriver)
router.put('/drivers/:id', requireRole(PERMISSIONS.DRIVERS_WRITE), updateDriver)
router.delete('/drivers/:id', requireRole(PERMISSIONS.DRIVERS_WRITE), deleteDriver)

export default router
