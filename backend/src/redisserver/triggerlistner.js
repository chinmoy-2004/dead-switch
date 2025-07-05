import { subscriber } from "./redis.config.js"; 
import enquetrigger from "./redis.qinit.js";


async function initRedisExpiryListener() {
  await subscriber.pSubscribe("__keyevent@0__:expired", async (key) => {
    if (key.startsWith("switch:")) {
      const switchId = key.split(":")[1];
      console.log(`Switch expired: ${switchId}`);
      await enquetrigger(switchId); // send to your trigger worker
    }
  });
}

export default initRedisExpiryListener;