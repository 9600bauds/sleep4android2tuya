import { TuyaContext } from "@tuya/tuya-connector-nodejs";

import dotenv from "dotenv";
dotenv.config();

export const tuyaContext = new TuyaContext({
  baseUrl: "https://openapi.tuyaus.com",
  accessKey: process.env.CLIENT_ID,
  secretKey: process.env.CLIENT_SECRET,
});
const basePath = `/v1.0/iot-03`;
/**
 * Sends a command to a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {Object} commandBody - The command body containing the instructions.
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
async function sendDeviceCommand(deviceID, commandBody) {
  const command = {
    path: `${basePath}/devices/${deviceID}/commands`,
    method: 'POST',
    body: commandBody
  };

  const response = await tuyaContext.request(command);

  if (!response.success) {
    console.log("Command failed!\nBody: ", commandBody, "\nResponse: ", response);
  }
}
/**
 * Toggles the light status of a device.
 *
 * @param {string} deviceID - The ID of the device.
 * @param {boolean} isLightOn - Specifies whether the light should be turned on (true) or off (false).
 * @returns {Promise} - A promise that resolves when the device command is sent.
 */
export function toggleLight(deviceID, isLightOn) {
  return sendDeviceCommand(deviceID, {
    "commands": [
      { "code": "switch_led", "value": isLightOn }
    ]
  });
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
export function setWhiteLight(deviceID, brightness, temperature) {
  return sendDeviceCommand(deviceID, {
    "commands": [
      { "code": "bright_value_v2", "value": brightness },
      { "code": "temp_value_v2", "value": temperature }
    ]
  });
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
export function setColorLight(deviceID, hue, saturation, brightness) {
  return sendDeviceCommand(deviceID, {
    "commands": [{
      "code": "colour_data_v2",
      "value": {
        "h": hue,
        "s": saturation || 1000,
        "v": brightness || 1000
      }
    }]
  });
}
