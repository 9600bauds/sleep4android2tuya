import * as hues from "../utils/hues.js";
import {
  ColoredTransition,
  WhiteTransition,
  QueuedTransition,
} from "../custom_commands/Transition.js";
import { QueuedCommand } from "../custom_commands/Command.js";
import {
  busy,
  addtoQueue,
  bedLight,
  deskLight,
  startTaskQueue,
} from "../index.js";

export async function gentleWakeUp(totalTime) {
  if (busy()) {
    console.log("Tried to wake up, but already busy!");
    return;
  }
  console.log("Starting wakeup...");

  let onetenth = totalTime / 10;
  addtoQueue(
    new QueuedCommand(deskLight, [
      { code: "bright_value_v2", value: hues.MIN_BRIGHTNESS },
      {
        code: "colour_data_v2",
        value: {
          h: hues.HUE_ORANGE,
          s: hues.MAX_SATURATION,
          v: hues.MID_BRIGHTNESS,
        },
      },
      { code: "switch_led", value: true },
    ])
  );
  addtoQueue(
    new QueuedCommand(bedLight, [
      { code: "bright_value_v2", value: hues.MIN_BRIGHTNESS },
      {
        code: "colour_data_v2",
        value: {
          h: hues.HUE_ORANGE,
          s: hues.MAX_SATURATION,
          v: hues.MID_BRIGHTNESS,
        },
      },
      { code: "switch_led", value: true },
    ])
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      onetenth / 2,
      ColoredTransition,
      { ...hues.DULL_ORANGE },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      bedLight,
      onetenth / 2,
      ColoredTransition,
      { ...hues.DULL_ORANGE, saturation: hues.MID_SATURATION },
      { ...hues.BRIGHT_ORANGE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      onetenth,
      WhiteTransition,
      { ...hues.DIM_WHITE },
      { ...hues.MID_WHITE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      deskLight,
      onetenth * 4,
      WhiteTransition,
      { ...hues.MID_WHITE },
      { ...hues.BRIGHT_WHITE }
    )
  );
  addtoQueue(
    new QueuedTransition(
      bedLight,
      onetenth * 4,
      WhiteTransition,
      { ...hues.DIM_WHITE, temperature: hues.MID_TEMPERATURE },
      { ...hues.BRIGHT_WHITE }
    )
  );
  startTaskQueue();
}
