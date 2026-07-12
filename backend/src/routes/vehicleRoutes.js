import { Router } from 'express'
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/vehicles', requireRole(PERMISSIONS.VEHICLES_READ), getVehicles)
router.get('/vehicles/:id', requireRole(PERMISSIONS.VEHICLES_READ), getVehicleById)
router.post('/vehicles', requireRole(PERMISSIONS.VEHICLES_WRITE), createVehicle)
router.put('/vehicles/:id', requireRole(PERMISSIONS.VEHICLES_WRITE), updateVehicle)
router.delete('/vehicles/:id', requireRole(PERMISSIONS.VEHICLES_WRITE), deleteVehicle)

export default router
