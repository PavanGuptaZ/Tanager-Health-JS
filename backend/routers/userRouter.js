import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router()



router.get('/', verifyJWT, (req, res) => {
    res.status(200).json({ message: "Working" })
})



export default router