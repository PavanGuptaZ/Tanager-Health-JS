import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import { getPersonsList, postPersons } from '../controllers/personController.js';

const router = express.Router()

router.use(verifyJWT)

router.get('/', getPersonsList)

router.post('/', postPersons)



export default router