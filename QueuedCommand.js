import { sendDeviceCommands } from "./tuyaCommands.js";

export class QueuedCommand {
  constructor(deviceID, commands) {
    this.deviceID = deviceID;
    this.commands = commands;
  }

  async generate() {
    return new Command(this.deviceID, this.commands);
  }
}

class Command {
  constructor(deviceID, commands) {
    this.deviceID = deviceID;
    this.commands = commands;
  }

  async step() {
    sendDeviceCommands(this.deviceID, this.commands)
    return true;
  }
}
