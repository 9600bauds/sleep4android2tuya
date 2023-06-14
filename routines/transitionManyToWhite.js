import {
  WhiteTransition,
  QueuedTransition,
} from "../custom_commands/Transition.js";
import {
  startTaskQueue,
  cancelTask,
  addtoQueue,
} from "../index.js";

export async function transitionManyToWhite(
  deviceIDs,
  totalTime,
  initialState,
  finalState
) {
  cancelTask();
  addtoQueue(
    new QueuedTransition(
      deviceIDs,
      totalTime,
      WhiteTransition,
      { ...initialState },
      { ...finalState }
    )
  );
  startTaskQueue();
}
