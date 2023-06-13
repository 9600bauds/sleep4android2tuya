import { toggleLight } from "../tuyaCommands.js";

class LightToggle {
  constructor(deviceID, isLightOn) {
    this.deviceID = deviceID;
    this.isLightOn = isLightOn;
  }

  async step() {
    toggleLight(this.deviceID, this.isLightOn);
    return true;
  }
}

export class QueuedToggle {
  constructor(deviceID, isLightOn) {
    this.deviceID = deviceID;
    this.isLightOn = isLightOn;
  }

  async generate() {
    return new LightToggle(this.deviceID, this.isLightOn);
  }
}
