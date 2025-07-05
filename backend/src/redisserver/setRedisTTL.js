import { redis } from "./redis.config.js";

const setRedisTTL=async(switchId,intervalMinutes)=>{
    const ttl=intervalMinutes*60
    await redis.set(`switch:${switchId}`, "active", {
        EX: ttl,
    });
}

export default setRedisTTL;