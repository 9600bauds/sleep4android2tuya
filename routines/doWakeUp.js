import * as hues from "../utils/hues.js";
import {
  ColoredTransition,
  WhiteTransition,
  QueuedTransition
} from "../custom_commands/Transition.js";
import { QueuedCommand } from "../custom_commands/Command.js";
import {
  busy,
  addtoQueue,
  bedLight,
  deskLight,
  startTaskQueue,
} from "../index.js";

let timeUnit = 1;

export async function doWakeUp() {
  if (busy()) {
    console.log("Tried to wake up, but already busy!");
    return;
  }
  console.log("Starting wakeup...");

  addtoQueue(
    new QueuedCommand(deskLight, [
      { code: "bright_value_v2", value: hues.MIN_BRIGHTNESS },
      { code: "colour_data_v2", value: { h: hues.HUE_ORANGE, s: hues.MAX_SATURATION, v: hues.MID_BRIGHTNESS } },
      { code: "switch_led", value: true },
    ])
  );
  addtoQueue(
    new QueuedCommand(bedLight, [
      { code: "bright_value_v2", value: hues.MIN_BRIGHTNESS },
      { code: "colour_data_v2", value: { h: hues.HUE_ORANGE, s: hues.MAX_SATURATION, v: hues.MID_BRIGHTNESS } },
      { code: "switch_led", value: true },
    ])
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      60*2 * timeUnit,
      ColoredTransition,
      { ...hues.DULL_ORANGE },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      bedLight,
      60*2 * timeUnit,
      ColoredTransition,
      { ...hues.DULL_ORANGE, saturation: hues.MID_SATURATION },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      60*5 * timeUnit,
      WhiteTransition,
      { ...hues.DIM_WHITE },
      { ...hues.MID_WHITE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      60*10 * timeUnit,
      WhiteTransition,
      { ...hues.MID_WHITE },
      { ...hues.BRIGHT_WHITE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      bedLight,
      60*10 * timeUnit,
      WhiteTransition,
      { ...hues.DIM_WHITE, temperature: hues.MID_TEMPERATURE },
      { ...hues.BRIGHT_WHITE }
    )
  );
  startTaskQueue();
}
