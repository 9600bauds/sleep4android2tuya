import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import * as hues from "./utils/hues.js";

import { gentleWakeUp } from "./routines/gentleWakeUp.js";
import { lighsOff } from "./routines/lightsOff.js";
import { transitionManyToWhite } from "./routines/transitionManyToWhite.js";
import { getAverageWhiteState } from "./utils/getAverageWhiteState.js";
import { gentleGoToSleep } from "./routines/gentleGoToSleep.js";

export const deskLight = process.env.DEVICE_ID_DESK;
export const bedLight = process.env.DEVICE_ID_BED;
export const allLights = [deskLight, bedLight];

const TICK_RATE = 1000; //Time in miliseconds between each refresh

// Task queue
export let taskQueue = [];
let currentTask = null;
let taskQueueInterval;

export function busy() {
  return currentTask || taskQueue.length > 0;
}

export function addtoQueue(obj) {
  return taskQueue.push(obj);
}

export function cancelTask() {
  currentTask = null;
  taskQueue = [];
}

export function startTaskQueue() {
  if (!taskQueueInterval) {
    taskQueueInterval = setInterval(processTaskQueue, TICK_RATE);
    processTaskQueue(); //Start immediately
  }
}

async function processTaskQueue() {
  // If there is no current task and there are tasks in the queue,
  // dequeue the next task, generate it, and assign it as the current task.
  while (!currentTask && taskQueue.length > 0) {
    currentTask = await taskQueue[0].generate();
    taskQueue.shift();
  }

  // If there is a current task, process a step.
  if (currentTask) {
    const taskComplete = await currentTask.step();
    // If the task has been completed, clear the current task.
    if (taskComplete) {
      currentTask = null;
    }
  } else {
    console.log("Finished the queue!");
    // If there is no current task and no tasks in the queue, clear the interval.
    clearInterval(taskQueueInterval);
    taskQueueInterval = null;
  }
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.post("/api/event", express.json(), async (request, response) => {
  const { event } = request.body;
  const eventUppercase = event.toUpperCase();
  switch (eventUppercase) {
    case "SLEEP_TRACKING_STOPPED":
    case "ALARM_ALERT_DISMISS":
    case "ALARM_ALERT_START":
      console.log("Woke up! ", event);
      response.status(202).send();
      transitionManyToWhite(
        allLights,
        30,
        await getAverageWhiteState(allLights),
        hues.BRIGHT_WHITE
      );
      break;
    case "SLEEP_TRACKING_STARTED":
      response.status(202).send();
      console.log("Starting sleep! ", event);
      lighsOff(allLights);
      break;
    case "SMART_PERIOD":
      response.status(202).send();
      console.log("Alarm soon! ", event);
      gentleWakeUp(60 * 15);
      break;
    case "TIME_TO_BED_ALARM_ALERT":
      response.status(202).send();
      console.log("Time for bed! ", event);
      gentleGoToSleep(60 * 15);
      break;
    default:
      console.log("Unknown event!", event);
      response.status(400).send();
      return;
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
