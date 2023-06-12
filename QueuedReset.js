import { resetLight } from "./tuyaCommands.js";

export class QueuedReset {
  constructor(deviceID) {
    this.deviceID = deviceID;
  }

  async generate() {
    return new LightReset(this.deviceID);
  }
}

class LightReset {
  constructor(deviceID) {
    this.deviceID = deviceID;
  }

  async step() {
    resetLight(this.deviceID);
    return true;
  }
}