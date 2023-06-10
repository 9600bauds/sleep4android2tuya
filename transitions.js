import {
  getDeviceStatus, setWhiteLight,
  setColorLight
} from "./tuyaCommands.js";
import { lerp, getProperty } from "./utils.js";
import { currentTask, setCurrentTask } from "./index.js";

/**
 * This function is called at each step of a color transition.
 */
export async function colorTransitionStep(startState, endState) {
  const timeFraction = (Date.now() - startState.time) / (endState.time - startState.time);

  if (timeFraction >= 1) {
    await setColorLight(
      currentTask.deviceID,
      currentTask.endState.hue,
      currentTask.endState.saturation,
      currentTask.endState.brightness
    );
    currentTask = null;
  } else {
    const newHue = lerp(
      currentTask.startState.hue,
      currentTask.endState.hue,
      timeFraction
    );
    const newSaturation = lerp(
      currentTask.startState.saturation,
      currentTask.endState.saturation,
      timeFraction
    );
    const newBrightness = lerp(
      currentTask.startState.brightness,
      currentTask.endState.brightness,
      timeFraction
    );

    await setColorLight(
      currentTask.deviceID,
      newHue,
      newSaturation,
      newBrightness
    );
  }
}
/**
 * This function is called at each step of a white transition.
 */
export async function whiteTransitionStep(startState, endState) {
  const timeFraction = (Date.now() - startState.time) / (endState.time - startState.time);

  if (timeFraction >= 1) {
    await setWhiteLight(
      currentTask.deviceID,
      currentTask.endState.brightness,
      currentTask.endState.temperature
    );
    currentTask = null;
  } else {
    const newBrightness = lerp(
      currentTask.startState.brightness,
      currentTask.endState.brightness,
      timeFraction
    );
    const newTemperature = lerp(
      currentTask.startState.temperature,
      currentTask.endState.temperature,
      timeFraction
    );

    await setWhiteLight(currentTask.deviceID, newBrightness, newTemperature);
  }
}
/**
 * Starts a light transition for a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {number} duration - The duration of the transition in seconds.
 * @param {number} finalBrightness - The final brightness for the transition.
 * @param {number} finalTemperature - The final temperature for the transition.
 */
export async function startWhiteTransition(
  deviceID,
  duration,
  finalBrightness,
  finalTemperature
) {
  console.log("Starting transition: ", arguments);
  const deviceStatus = await getDeviceStatus(deviceID);
  const initialBrightness = getProperty(deviceStatus, "bright_value_v2");
  const initialTemperature = getProperty(deviceStatus, "temp_value_v2");

  let newTask = {
    action: "whiteTransition",
    deviceID: deviceID,
    startState: {
      time: Date.now(),
      brightness: initialBrightness,
      temperature: initialTemperature,
    },
    endState: {
      time: Date.now() + duration * 1000,
      brightness: finalBrightness,
      temperature: finalTemperature,
    },
  };
  setCurrentTask(newTask);
}
/**
 * Starts a color transition for a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {number} duration - The duration of the transition in seconds.
 * @param {number} finalHue - The final hue for the transition.
 * @param {number} finalSaturation - The final saturation for the transition.
 * @param {number} finalBrightness - The final brightness for the transition.
 */

export async function startColorTransition(
  deviceID,
  duration,
  finalHue,
  finalSaturation,
  finalBrightness
) {
  const deviceStatus = await getDeviceStatus(deviceID);
  const initialColorData = JSON.parse(
    getProperty(deviceStatus, "colour_data_v2")
  );

  const initialHue = initialColorData.h;
  const initialSaturation = initialColorData.s;
  const initialBrightness = initialColorData.v;

  let newTask = {
    action: "colorTransition",
    deviceID: deviceID,
    startState: {
      time: Date.now(),
      hue: initialHue,
      saturation: initialSaturation,
      brightness: initialBrightness,
    },
    endState: {
      time: Date.now() + duration * 1000,
      hue: finalHue,
      saturation: finalSaturation,
      brightness: finalBrightness,
    },
  };
  setCurrentTask(newTask);
}
