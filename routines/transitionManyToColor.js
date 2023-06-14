import {
  ColoredTransition,
  QueuedTransition,
} from "../custom_commands/Transition.js";
import {
  startTaskQueue,
  cancelTask,
  addtoQueue,
} from "../index.js";

export async function transitionManyToColor(deviceIDs, totalTime, initialState, finalState) {
  cancelTask();
  addtoQueue(
    new QueuedTransition(
      deviceIDs,
      totalTime,
      ColoredTransition,
      { ...initialState },
      { ...finalState }
    )
  );
  startTaskQueue();
}
