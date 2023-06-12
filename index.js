import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import { doWakeUp } from "./doWakeUp.js";

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

export function startTaskQueue() {
  if (!taskQueueInterval) {
    taskQueueInterval = setInterval(processTaskQueue, TICK_RATE);
    processTaskQueue(); //Start immediately
  }
}

async function processTaskQueue() {
  console.log("Processing...");
  // If there is no current task and there are tasks in the queue,
  // dequeue the next task, generate it, and assign it as the current task.
  while (!currentTask && taskQueue.length > 0) {
    console.log("Popping task");
    currentTask = await taskQueue[0].generate();
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

app.get("/api/event/:eventName", async (request, response) => {
  doWakeUp();
  response.send("<h1>" + request.params.eventName + "</h1>");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
