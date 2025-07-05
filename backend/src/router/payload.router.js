import express from 'express';
import { createPayload, getPayloadBySwitchId } from '../controller/payload.controller.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/createpayload',upload.array('attachments'),createPayload);
router.get('/getpayloadbyswitchid/:id',getPayloadBySwitchId);

export default router;