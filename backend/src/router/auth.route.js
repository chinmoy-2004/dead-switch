import express from 'express';
import { login,Signup,logout, checkauth } from '../controller/auth.controller.js';
import { protectroute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/checkauth', protectroute,checkauth)

export default router;

