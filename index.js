import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import { tuyaContext, toggleLight, setWhiteLight, setColorLight } from "./tuyaCommands.js";

import * as hues from './hues.js';

const deskLight = process.env.DEVICE_ID_DESK
const bedLight = process.env.DEVICE_ID_BED

/*toggleLight(deskLight, 10, 1000)
setWhiteLight(deskLight, 10, 1000)
setColorLight(deskLight, hues.HUE_ORANGE, 1000, 1000)*/

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/event/:eventName", (request, response) => {
  response.send("<h1>" + request.params.eventName + "</h1>");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
