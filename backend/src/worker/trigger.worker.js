import { Worker } from "bullmq";
import Switch from "../schema/Switch.schema.js"; 
import Payload from "../schema/payload.schema.js";
import dotenv from "dotenv";
dotenv.config();

import {  sendEmail } from "../lib/delivey.js";
const connection = {
  url: process.env.REDIS_URL
};

const worker = new Worker("expiryQueue", async job => {
  const { switchId } = job.data;

  console.log(`⏰ Triggering switch: ${switchId}`);

  const sw = await Switch.findById(switchId);
  if (!sw || sw.status !== "active") return;

  const now = new Date();
  const expiryTime = new Date(sw.lastping.getTime() + sw.interval * 60000);
  if (now < expiryTime) return; // still not expired, ignore

  const payload = await Payload.findOne({ switchId });
  if (!payload) {
    console.error(`❌ No payload found for switch ${switchId}`);
    return;
  }

   await sendEmail(payload);

  // ✅ Mark as expired
  sw.status = "expired";
  await sw.save();
  
  console.log(`✅ Switch ${switchId} triggered and marked as expired`);
}, { connection });

worker.on("failed", (job, err) => {
  console.error("Worker job failed:", err);
});

export default worker;
