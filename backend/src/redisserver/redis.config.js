// redisClient.js
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL, // uses the Redis URL from Render env
});
const subscriber = redis.duplicate();

redis.on("error", (err) => console.error("Redis client error", err));
subscriber.on("error", (err) => console.error("Redis subscriber error", err));

const connectRedis = async () => {
  await redis.connect();
  await subscriber.connect();
  await redis.configSet("notify-keyspace-events", "Ex");
};

export { redis, subscriber, connectRedis };
