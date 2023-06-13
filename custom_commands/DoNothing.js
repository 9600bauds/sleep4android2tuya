export class DoNothing {
  async step() {
    return true;
  }
}

export class QueuedDoNothing {
  async generate() {
    return new DoNothing();
  }
}
