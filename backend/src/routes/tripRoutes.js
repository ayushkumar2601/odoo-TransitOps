import { Router } from 'express'
import {
  getTrips,
  getTripById,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
} from '../controllers/tripController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/trips', requireRole(PERMISSIONS.TRIPS_READ), getTrips)
router.get('/trips/:id', requireRole(PERMISSIONS.TRIPS_READ), getTripById)
router.post('/trips', requireRole(PERMISSIONS.TRIPS_WRITE), createTrip)
router.post('/trips/:id/dispatch', requireRole(PERMISSIONS.TRIPS_WRITE), dispatchTrip)
router.put('/trips/:id/dispatch', requireRole(PERMISSIONS.TRIPS_WRITE), dispatchTrip)
router.post('/trips/:id/complete', requireRole(PERMISSIONS.TRIPS_WRITE), completeTrip)
router.put('/trips/:id/complete', requireRole(PERMISSIONS.TRIPS_WRITE), completeTrip)
router.post('/trips/:id/cancel', requireRole(PERMISSIONS.TRIPS_WRITE), cancelTrip)
router.put('/trips/:id/cancel', requireRole(PERMISSIONS.TRIPS_WRITE), cancelTrip)

export default router
