import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import {
  tuyaContext,
  toggleLight,
} from "./tuyaCommands.js";
import * as hues from "./hues.js";
import { whiteTransitionStep, colorTransitionStep, startWhiteTransition, startColorTransition } from "./transitions.js";

const deskLight = process.env.DEVICE_ID_DESK;
const bedLight = process.env.DEVICE_ID_BED;

const TICK_RATE = 5000;

export let currentTask = null;

// Execute the current task
async function executeCurrentTask() {
  if (!currentTask) return;
  let { action, startState, endState } = currentTask;
  console.log("Executing task: ", action, startState, endState);

  if (action === "whiteTransition") {
    await whiteTransitionStep(startState, endState);
  } else if (action === "colorTransition") {
    await colorTransitionStep(startState, endState);
  }
}

export function setCurrentTask(task) {
  console.log("Setting task to ", task);
  // If there's no ongoing task, we set an interval
  if (!currentTask) {
    currentTask = task;
    setInterval(async function () {
      // If the task has completed, clear the interval
      if (!currentTask) {
        clearInterval(this);
      }
      executeCurrentTask();
    }, TICK_RATE);
    executeCurrentTask(); //Execute right now, to start
  }
  // If there's an ongoing task, we simply replace it
  else {
    currentTask = task;
  }
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/event/:eventName", (request, response) => {
  toggleLight(deskLight, false);
  startWhiteTransition(bedLight, 60, 1000, 1000);

  response.send("<h1>" + request.params.eventName + "</h1>");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
