import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import { doWakeUp } from "./routines/doWakeUp.js";
import { alarmStopped } from "./routines/alarmStopped.js";
import { sleepStart } from "./routines/sleepStart.js";

export const deskLight = process.env.DEVICE_ID_DESK;
export const bedLight = process.env.DEVICE_ID_BED;

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
    console.log("Popping task!", currentTask);
    taskQueue.shift();
  }

  // If there is a current task, process a step.
  if (currentTask) {
    const taskComplete = await currentTask.step();
    // If the task has been completed, clear the current task.
    if (taskComplete) {
      console.log("Task complete!");
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
      console.log("Woke up! ", event);
      alarmStopped();
      break;
    case "SLEEP_TRACKING_STARTED":
      console.log("Starting sleep! ", event);
      sleepStart();
      break;
    case "SMART_PERIOD":
      console.log("Alarm soon! ", event);
      doWakeUp();
      break;
    default:
      console.log("Unknown event!", event);
      response.status(400);
      return;
  }
  response.status(202);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
