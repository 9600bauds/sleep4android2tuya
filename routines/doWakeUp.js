import * as hues from "../utils/hues.js";
import { QueuedTransition } from "../custom_commands/Transition.js";
import {
  ColoredTransition,
  WhiteTransition,
} from "../custom_commands/Transition.js";
import { QueuedCommand } from "../custom_commands/Command.js";
import { QueuedSwap } from "../custom_commands/LightSwap.js";
import { QueuedReset } from "../custom_commands/LightReset.js";
import {
  busy,
  taskQueue,
  bedLight,
  deskLight,
  startTaskQueue,
} from "../index.js";

export async function doWakeUp() {
  if (busy()) {
    console.log("Tried to wake up, but already busy!");
    return;
  }
  console.log("Starting wakeup...");

  taskQueue.push(new QueuedReset(bedLight));
  taskQueue.push(new QueuedReset(deskLight));
  taskQueue.push(
    //Just wait for a little bit here
    new QueuedCommand(bedLight, []),
    new QueuedCommand(bedLight, []),
    new QueuedCommand(bedLight, [])
  );
  taskQueue.push(
    new QueuedCommand(deskLight, [{ code: "switch_led", value: true }])
  );
  taskQueue.push(
    new QueuedTransition(
      deskLight,
      5,
      ColoredTransition,
      { ...hues.DULL_ORANGE },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  taskQueue.push(
    new QueuedCommand(bedLight, [{ code: "switch_led", value: true }])
  );
  taskQueue.push(
    new QueuedTransition(
      bedLight,
      5,
      ColoredTransition,
      { ...hues.DULL_ORANGE, saturation: hues.MID_SATURATION },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  taskQueue.push(new QueuedSwap(deskLight, bedLight));
  taskQueue.push(
    new QueuedTransition(
      deskLight,
      5,
      WhiteTransition,
      { ...hues.DIM_WHITE },
      { ...hues.MID_WHITE }
    )
  );
  taskQueue.push(
    new QueuedTransition(
      deskLight,
      5,
      WhiteTransition,
      { ...hues.MID_WHITE },
      { ...hues.BRIGHT_WHITE }
    )
  );
  taskQueue.push(
    new QueuedCommand(bedLight, [{ code: "switch_led", value: true }])
  );
  taskQueue.push(
    new QueuedTransition(
      bedLight,
      5,
      WhiteTransition,
      { ...hues.DIM_WHITE, temperature: hues.MID_TEMPERATURE },
      { ...hues.BRIGHT_WHITE }
    )
  );

  startTaskQueue();
}
