import express from 'express';
import { register, login, refresh, logout, updatedata } from '../controllers/authControllers.js'
import loginLimiter from '../middleware/loginLimiter.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()


router.post('/register', loginLimiter, register, login)

router.post('/login', loginLimiter, login)

router.get('/refresh', refresh)

router.post('/logout', logout)

router.post('/update/:role', verifyJWT, updatedata)

export default router