import * as hues from "../utils/hues.js";import {
  ColoredTransition,
  QueuedTransition,
} from "../custom_commands/Transition.js";
import { QueuedCommand } from "../custom_commands/Command.js";
import { transitionManyToWhite } from "../routines/transitionManyToWhite.js";
import { getAverageWhiteState } from "../utils/getAverageWhiteState.js";
import { busy, addtoQueue, allLights, startTaskQueue } from "../index.js";

export async function gentleGoToSleep(totalTime) {
  if (busy()) {
    console.log("Time for bed, but already busy!");
    return;
  }
  console.log("Time for bed...");

  let onetenth = totalTime / 10;

  transitionManyToWhite(
    allLights,
    onetenth * 7,
    await getAverageWhiteState(allLights),
    hues.DIM_WHITE
  );
  addtoQueue(
    new QueuedCommand(allLights, [
      {
        code: "colour_data_v2",
        value: {
          h: hues.HUE_ORANGE,
          s: hues.MAX_SATURATION,
          v: hues.MAX_BRIGHTNESS,
        },
      },
    ])
  );
  addtoQueue(
    new QueuedTransition(
      allLights,
      onetenth * 3,
      ColoredTransition,
      { ...hues.BRIGHT_ORANGE },
      { ...hues.DULL_ORANGE }
    )
  );
  startTaskQueue();
}
