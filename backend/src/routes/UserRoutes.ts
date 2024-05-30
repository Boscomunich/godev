import express from 'express';
import { registerUser, logIn } from '../controllers/User'

const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(logIn)

export default router