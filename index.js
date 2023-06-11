import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import * as hues from "./hues.js";

import { QueuedTransition } from "./QueuedTransition.js"
import { Transition, ColoredTransition, WhiteTransition } from "./Transition.js"
import { resetLight, sendDeviceCommands, setColorLight, toggleLight } from "./tuyaCommands.js";
import { QueuedCommand } from "./QueuedCommand.js";
import { QueuedSwap } from "./QueuedSwap.js";

const deskLight = process.env.DEVICE_ID_DESK;
const bedLight = process.env.DEVICE_ID_BED;

const TICK_RATE = 500;

// Task queue
let taskQueue = [];
let currentTask = null;

// Process the task queue
async function processTaskQueue() {
  if(currentTask){
    const taskComplete = await currentTask.step();
    // If the task is complete, delete it
    if (taskComplete) {
      currentTask = null
    }
  }
  else if (taskQueue.length > 0) {
    currentTask = await taskQueue[0].generate();
    taskQueue.shift();    
  }
  else{
    return
  }
  setTimeout(processTaskQueue, TICK_RATE);
}


app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/event/:eventName", async (request, response) => {
  //toggleLight(deskLight, false);
  //startWhiteTransition(bedLight, 60, 1000, 1000);
  await resetLight(bedLight)
  await resetLight(deskLight)

  taskQueue.push(new QueuedCommand(deskLight, [{ code: "switch_led", value: true }]))
  let stage1_start = {hue: hues.HUE_ORANGE, saturation: 1000, brightness: 10}
  let stage1_end = {hue: hues.HUE_ORANGE, saturation: 750, brightness: 1000}
  let stage1 = new QueuedTransition(deskLight, 5, ColoredTransition, stage1_start, stage1_end)
  taskQueue.push(stage1);
  taskQueue.push(new QueuedCommand(bedLight, [{ code: "switch_led", value: true }]))
  let stage2_start = {hue: hues.HUE_ORANGE, saturation: 750, brightness: 10}
  let stage2_end = {hue: hues.HUE_ORANGE, saturation: 750, brightness: 1000}
  let stage2 = new QueuedTransition(bedLight, 5, ColoredTransition, stage2_start, stage2_end)
  taskQueue.push(stage2);
  taskQueue.push(new QueuedSwap(deskLight, bedLight))
  let stage3_start = {temperature: 10, brightness: 10}
  let stage3_end = {temperature: 100, brightness: 100}
  let stage3 = new QueuedTransition(deskLight, 5, WhiteTransition, stage3_start, stage3_end)
  taskQueue.push(stage3);
  let stage35_start = {temperature: 100, brightness: 100}
  let stage35_end = {temperature: 1000, brightness: 1000}
  let stage35 = new QueuedTransition(deskLight, 5, WhiteTransition, stage35_start, stage35_end)
  taskQueue.push(stage35);
  taskQueue.push(new QueuedCommand(bedLight, [{ code: "switch_led", value: true }]))
  let stage4_start = {hue: hues.HUE_ORANGE, temperature: 1000, brightness: 0}
  let stage4_end = {hue: hues.HUE_ORANGE, temperature: 1000, brightness: 1000}
  let stage4 = new QueuedTransition(bedLight, 5, WhiteTransition, stage4_start, stage4_end)
  taskQueue.push(stage4);
  setTimeout(processTaskQueue, TICK_RATE);


  response.send("<h1>" + request.params.eventName + "</h1>");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
