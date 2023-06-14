import {
  bedLight,
  deskLight,
  startTaskQueue,
  cancelTask,
  addtoQueue,
} from "../index.js";
import { QueuedReset } from "../custom_commands/LightReset.js";

export async function lighsOff(deviceIDs) {
  cancelTask();
  addtoQueue(
    new QueuedReset(deviceIDs),
  );
  startTaskQueue();
}
