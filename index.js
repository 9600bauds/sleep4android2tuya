import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import axios from 'axios';

import { TuyaContext } from "@tuya/tuya-connector-nodejs";

const tuya = new TuyaContext({
  baseUrl: "https://openapi.tuyaus.com",
  accessKey: process.env.CLIENT_ID,
  secretKey: process.env.CLIENT_SECRET,
});

const deskLight = await tuya.device.detail({
  device_id: process.env.DEVICE_ID_DESK,
});
const bedLight = await tuya.device.detail({
  device_id: process.env.DEVICE_ID_BED,
});

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
