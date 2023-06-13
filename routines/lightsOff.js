import {
  bedLight,
  deskLight,
  startTaskQueue,
  cancelTask,
  addtoQueue,
} from "../index.js";
import { QueuedReset } from "../custom_commands/LightReset.js";

export async function lighsOff() {
  cancelTask();
  addtoQueue(
    new QueuedReset(bedLight),
  );
  addtoQueue(
    new QueuedReset(deskLight),
  );
  startTaskQueue();
}
