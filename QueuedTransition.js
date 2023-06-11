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

    return new this.transitionClass(this.deviceID, this.startState, this.endState);
  }
}