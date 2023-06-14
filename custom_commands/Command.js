import { sendDeviceCommandsToMany } from "../tuyaCommands.js";

class Command {
  constructor(deviceIDs, commands) {
    this.deviceIDs = deviceIDs;
    this.commands = commands;
  }

  async step() {
    sendDeviceCommandsToMany(this.deviceIDs, this.commands);
    return true;
  }
}

export class QueuedCommand {
  constructor(deviceIDs, commands) {
    this.deviceIDs = deviceIDs;
    this.commands = commands;
  }

  async generate() {
    return new Command(this.deviceIDs, this.commands);
  }
}
