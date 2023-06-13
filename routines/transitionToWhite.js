import * as hues from "../utils/hues.js";
import {
  WhiteTransition,
  QueuedTransition,
} from "../custom_commands/Transition.js";
import {
  bedLight,
  deskLight,
  startTaskQueue,
  cancelTask,
  addtoQueue,
} from "../index.js";
import { getDeviceStatus } from "../tuyaCommands.js";
import { getProperty } from "../utils/utils.js";
import { QueuedCommand } from "../custom_commands/Command.js";

export async function transitionToWhite(totalTime) {
  cancelTask();
  addtoQueue(
    new QueuedCommand(deskLight, [{ code: "switch_led", value: true }])
  );
  addtoQueue(
    new QueuedCommand(bedLight, [{ code: "switch_led", value: true }])
  );
  const deskData = await getDeviceStatus(deskLight);
  const deskWorkMode = getProperty(deskData, "work_mode");
  const deskBrightness =
    deskWorkMode === "white"
      ? getProperty(deskData, "bright_value_v2")
      : hues.MIN_BRIGHTNESS;
  const deskTemperature =
    deskWorkMode === "white"
      ? getProperty(deskData, "temp_value_v2")
      : hues.MIN_TEMPERATURE;
  if (
    deskBrightness < hues.MAX_BRIGHTNESS ||
    deskTemperature < hues.MAX_TEMPERATURE
  ) {
    const deskState = {
      brightness: deskBrightness,
      temperature: deskTemperature,
    };
    addtoQueue(
      new QueuedTransition(
        deskLight,
        totalTime / 2,
        WhiteTransition,
        { ...deskState },
        { ...hues.BRIGHT_WHITE }
      )
    );
  }
  const bedData = await getDeviceStatus(bedLight);
  const bedWorkMode = getProperty(bedData, "work_mode");
  const bedBrightness =
    bedWorkMode === "white"
      ? getProperty(bedData, "bright_value_v2")
      : hues.MIN_BRIGHTNESS;
  const bedTemperature =
    bedWorkMode === "white"
      ? getProperty(bedData, "temp_value_v2")
      : hues.MIN_TEMPERATURE;
  if (
    bedBrightness < hues.MAX_BRIGHTNESS ||
    bedTemperature < hues.MAX_TEMPERATURE
  ) {
    const bedState = {
      brightness: bedBrightness,
      temperature: bedTemperature,
    };
    addtoQueue(
      new QueuedTransition(
        bedLight,
        totalTime / 2,
        WhiteTransition,
        { ...bedState },
        { ...hues.BRIGHT_WHITE }
      )
    );
  }
  startTaskQueue();
}
