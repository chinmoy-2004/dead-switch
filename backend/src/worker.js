
import triggerworker from "./worker/trigger.worker.js";

(async () => {
  console.log("🚀 BullMQ Worker process started...");
  await triggerworker; // Starts processing jobs
})();
