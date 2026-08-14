import express, { type Express } from "express";
import jobRouter from "./routes/jobs.js";


export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use("/api/jobs", jobRouter);

  return app;
}
