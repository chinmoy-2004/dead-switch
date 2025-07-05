// bullmqQueue.js
import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const myQueue = new Queue("expiryQueue", {
  connection: {
    url: process.env.REDIS_URL
  }
});

const enquetrigger = async (switchId) => {
  await myQueue.add("trigger", { switchId });
};

export default enquetrigger;
