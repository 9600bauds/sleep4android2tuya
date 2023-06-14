import { toggleLight } from "../tuyaCommands.js";

class LightToggle {
  constructor(deviceIDs, isLightOn) {
    this.deviceIDs = deviceIDs;
    this.isLightOn = isLightOn;
  }

  async step() {
    toggleLight(this.deviceIDs, this.isLightOn);
    return true;
  }
}

export class QueuedToggle {
  constructor(deviceIDs, isLightOn) {
    this.deviceIDs = deviceIDs;
    this.isLightOn = isLightOn;
  }

  async generate() {
    return new LightToggle(this.deviceIDs, this.isLightOn);
  }
}
