import { TuyaContext } from "@tuya/tuya-connector-nodejs";

import dotenv from "dotenv";
dotenv.config();

import * as hues from "./hues.js";

export const tuyaContext = new TuyaContext({
  baseUrl: "https://openapi.tuyaus.com",
  accessKey: process.env.CLIENT_ID,
  secretKey: process.env.CLIENT_SECRET,
});
const basePath = `/v1.0/iot-03`;

/**
 * Fetches the current status of a device.
 * The result is an array of objects, each representing a certain parameter of the device
 * (identified by 'code') and its current value.
 *
 * For example:
 * [
 *   { code: 'switch_led', value: true },
 *   { code: 'work_mode', value: 'white' },
 *   ...
 * ]
 *
 * @param {string} deviceID - The ID of the device whose status is to be fetched.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of objects, each containing a device parameter and its current value.
 */
export async function getDeviceStatus(deviceID) {
  const command = {
    path: `${basePath}/devices/${deviceID}/status`,
    method: "GET",
  };

  const response = await tuyaContext.request(command);
  if (!response.success) {
    console.log(
      `Could not get status for device ${deviceID}! \nResponse: `,
      response
    );
  }
  return response.result;
}

/**
 * Sends a command to a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {Object} commandBody - The command body containing the instructions.
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export async function sendDeviceCommands(deviceID, commands) {
  const command = {
    path: `${basePath}/devices/${deviceID}/commands`,
    method: "POST",
    body: {
      commands: commands,
    },
  };

  const response = await tuyaContext.request(command);

  if (!response.success) {
    console.log(
      "Command failed!\Commands: ",
      commands,
      "\nResponse: ",
      response
    );
  }
  return response;
}
/**
 * Toggles the light status of a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {boolean} isLightOn - Specifies whether the light should be turned on (true) or off (false).
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export async function toggleLight(deviceID, isLightOn) {
  return sendDeviceCommands(deviceID, [
    { code: "switch_led", value: isLightOn },
  ]);
}
/**
 * Sets the device to white light mode.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {number} brightness - The brightness value ranging from 10 to 1000.
 * @param {number} temperature - The temperature value ranging from 10 to 1000.
 *                               Minimum temperature represents incandescent light (orange-ish),
 *                               while the maximum temperature represents daylight (white).
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export async function setWhiteLight(deviceID, brightness, temperature) {
  const roundedBrightness = Math.round(brightness);
  const roundedTemperature = Math.round(temperature);

  console.log(roundedBrightness)

  return sendDeviceCommands(deviceID, [
    { code: "bright_value_v2", value: roundedBrightness },
    { code: "temp_value_v2", value: roundedTemperature },
  ]);
}
/**
 * Sets the device to colored light mode.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {number} hue - The hue value ranging from 0 to 360.
 * @param {number} [saturation=1000] - The saturation value ranging from 10 to 1000.
 * @param {number} [brightness=1000] - The brightness value ranging from 10 to 1000.
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export async function setColorLight(deviceID, hue, saturation, brightness) {
  const roundedHue = Math.round(hue);
  const roundedSaturation = Math.round(saturation || 1000);
  const roundedBrightness = Math.round(brightness || 1000);

  return sendDeviceCommands(deviceID, [
    {
      code: "colour_data_v2",
      value: {
        h: roundedHue,
        s: roundedSaturation,
        v: roundedBrightness,
      },
    },
  ]);
}

/**
 * Turns the light off and sets all brightness values to minimum.
 *
 * @param {string} deviceID - The ID of the device.
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export async function resetLight(deviceID) {
  return sendDeviceCommands(deviceID, [
    { code: "switch_led", value: false },
    { code: "colour_data_v2", value: { h: hues.HUE_ORANGE, s: 1000, v: 10 } },
    { code: "bright_value_v2 ", value: 10 },
  ]);
}

export async function doTheSwap(deviceID1, deviceID2) {
  resetLight(deviceID2);
  return setWhiteLight(deviceID1, 10, 10);
}
