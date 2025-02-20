require("dotenv").config();
import { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB, sequelize } from "./db";
import tagRouter from "./routes";
import express from "express";
import http from "http";
import WebSocket from "ws";
import axios from "axios";
import TagModel from "./models/tagModel";
import { handleDisconnect, handleMessage } from "./listener";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", handleMessage);
  ws.on("close", handleDisconnect);
});

app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

app.get("/api/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});

app.use("/api/tags", tagRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

app.listen(process.env.PORT, async () => {
  console.log("server started Successfully");
  await connectDB();
  sequelize.sync({ force: false }).then(() => {
    console.log("Synced database successfully...");
  });
});
