import { getDeviceStatus } from "../tuyaCommands.js";
import { getProperty } from "./utils.js";

export async function getAverageWhiteState(deviceIDs) {
  const deviceStatuses = await Promise.all(deviceIDs.map(getDeviceStatus));
  const deviceValues = deviceStatuses.map((data) => {
    const workMode = getProperty(data, "work_mode");
    return {
      brightness:
        workMode === "white"
          ? getProperty(data, "bright_value_v2")
          : hues.MIN_BRIGHTNESS,
      temperature:
        workMode === "white"
          ? getProperty(data, "temp_value_v2")
          : hues.MIN_TEMPERATURE,
    };
  });

  const avgState = deviceValues.reduce(
    (acc, bulb) => ({
      brightness: acc.brightness + bulb.brightness / deviceValues.length,
      temperature: acc.temperature + bulb.temperature / deviceValues.length,
    }),
    { brightness: 0, temperature: 0 }
  );
  return avgState;
}
