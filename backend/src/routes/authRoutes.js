import { Router } from 'express'
import { loginUser, getCurrentUser } from '../controllers/authController.js'

const router = Router()

router.post('/auth/login', loginUser)
router.get('/auth/me', getCurrentUser)

export default router
