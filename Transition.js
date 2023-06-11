import { setWhiteLight, setColorLight } from "./tuyaCommands.js";
import { lerp } from "./utils.js"

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
