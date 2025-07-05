import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { connectRedis } from './redisserver/redis.config.js';
import initRedisExpiryListener from './redisserver/triggerlistner.js';
import dotenv from 'dotenv';
import authRoutes from './router/auth.route.js';
import switchRoutes from "./router/switch.route.js"
// import triggerworker from "./worker/trigger.worker.js"
import payloadroutes from './router/payload.router.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN, // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/switch', switchRoutes);
app.use('/api/payload', payloadroutes); // Serve static files from 'uploads' directory


(async () => {
  await connectRedis();
  await initRedisExpiryListener();
  // await triggerworker;
})();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
