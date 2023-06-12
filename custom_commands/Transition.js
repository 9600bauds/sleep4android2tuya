import { setWhiteLight, setColorLight } from "../tuyaCommands.js";
import { lerp } from "../utils/utils.js";

export class Transition {
  constructor(deviceID, startState, endState) {
    this.deviceID = deviceID;
    this.startState = startState;
    this.endState = endState;
  }

  async step() {
    return true;
  }
}
export class ColoredTransition extends Transition {
  async step() {
    const timeFraction =
      (Date.now() - this.startState.time) /
      (this.endState.time - this.startState.time);

    if (timeFraction >= 1) {
      await setColorLight(
        this.deviceID,
        this.endState.hue,
        this.endState.saturation,
        this.endState.brightness
      );
      return true;
    } else {
      const newHue = lerp(this.startState.hue, this.endState.hue, timeFraction);
      const newSaturation = lerp(
        this.startState.saturation,
        this.endState.saturation,
        timeFraction
      );
      const newBrightness = lerp(
        this.startState.brightness,
        this.endState.brightness,
        timeFraction
      );

      await setColorLight(this.deviceID, newHue, newSaturation, newBrightness);
      return false;
    }
  }
}
export class WhiteTransition extends Transition {
  async step() {
    const timeFraction =
      (Date.now() - this.startState.time) /
      (this.endState.time - this.startState.time);

    if (timeFraction >= 1) {
      await setWhiteLight(
        this.deviceID,
        this.endState.brightness,
        this.endState.temperature
      );
      return true;
    } else {
      const newBrightness = lerp(
        this.startState.brightness,
        this.endState.brightness,
        timeFraction
      );
      const newTemperature = lerp(
        this.startState.temperature,
        this.endState.temperature,
        timeFraction
      );
      await setWhiteLight(this.deviceID, newBrightness, newTemperature);
      return false;
    }
  }
}

export class QueuedTransition {
  /**
   * @param {string} deviceID - The ID of the device on which the transition will be applied.
   * @param {number} duration - The duration of the transition in milliseconds.
   * @param {Function} transitionClass - The class representing the type of transition.
   * @param {Object} startState - The initial state of the transition.
   * @param {Object} endState - The final state of the transition.
   */
  constructor(deviceID, duration, transitionClass, startState, endState) {
    this.deviceID = deviceID;
    this.duration = duration;
    this.transitionClass = transitionClass;
    this.startState = startState;
    this.endState = endState;
  }

  /**
   * Generates a new instance of the transitionClass.
   * If no starting or ending times are provided, they are set as the current time and (current time + duration), respectively.
   *
   * @returns {Promise<Object>} A promise that resolves with a new instance of transitionClass.
   */
  async generate() {
    if (!this.startState.time) {
      this.startState.time = Date.now();
    }
    if (!this.endState.time) {
      this.endState.time = this.startState.time + this.duration * 1000; //*1000 because duration is in seconds, but times are in miliseconds
    }

    return new this.transitionClass(
      this.deviceID,
      this.startState,
      this.endState
    );
  }
}
