import { resetLight } from "../tuyaCommands.js";

class LightReset {
  constructor(deviceIDs) {
    this.deviceIDs = deviceIDs;
  }

  async step() {
    resetLight(this.deviceIDs);
    return true;
  }
}

export class QueuedReset {
  constructor(deviceIDs) {
    this.deviceIDs = deviceIDs;
  }

  async generate() {
    return new LightReset(this.deviceIDs);
  }
}
