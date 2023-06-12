import { doTheSwap } from "./tuyaCommands.js";

export class QueuedSwap {
  constructor(deviceID1, deviceID2) {
    this.deviceID1 = deviceID1;
    this.deviceID2 = deviceID2;
  }

  async generate() {
    return new LightSwap(this.deviceID1, this.deviceID2);
  }
}

class LightSwap {
  constructor(deviceID1, deviceID2) {
    this.deviceID1 = deviceID1;
    this.deviceID2 = deviceID2;
  }

  async step() {
    doTheSwap(this.deviceID1, this.deviceID2);
    return true;
  }
}
