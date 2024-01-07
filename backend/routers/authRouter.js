import express from 'express';
import { register, login, refresh } from '../controllers/authContorollers.js'
import loginLimiter from '../middleware/loginLimiter.js'

const router = express.Router()

router.use(loginLimiter)

router.post('/register', register, login)

router.post('/login', login)

router.get('/refresh', refresh)

export default router