import express from 'express';
import { createSwitch, deleteSwitch, getSwitchById, getSwitches, pingSwitch } from '../controller/swich.controller.js';
import { protectroute } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.use(protectroute); // Apply protectroute middleware to all routes in this router

router.post('/createswitch', upload.none(),createSwitch);

router.get('/getswitches', getSwitches);

router.post('/pingswitch/:id', pingSwitch);

router.post('/deleteswitch/:id',deleteSwitch);

router.get('/getswitch/:id', getSwitchById);

export default router;