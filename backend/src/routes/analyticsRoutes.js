import { Router } from 'express'
import {
  getDashboardSummary,
  getComprehensiveAnalytics
} from '../controllers/analyticsController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/dashboard', requireRole(PERMISSIONS.ANALYTICS_READ), getDashboardSummary)
router.get('/analytics', requireRole(PERMISSIONS.ANALYTICS_READ), getComprehensiveAnalytics)

export default router
