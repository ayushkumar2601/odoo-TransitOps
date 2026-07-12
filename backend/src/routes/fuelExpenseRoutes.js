import { Router } from 'express'
import {
  getFuelLogs,
  createFuelLog,
  getExpenses,
  createExpense
} from '../controllers/fuelExpenseController.js'
import { requireRole, PERMISSIONS } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/fuel-logs', requireRole(PERMISSIONS.EXPENSES_READ), getFuelLogs)
router.post('/fuel-logs', requireRole(PERMISSIONS.EXPENSES_WRITE), createFuelLog)
router.get('/expenses', requireRole(PERMISSIONS.EXPENSES_READ), getExpenses)
router.post('/expenses', requireRole(PERMISSIONS.EXPENSES_WRITE), createExpense)

export default router
