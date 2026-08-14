import express, { type Express } from "express";
import jobRouter from "./routes/jobs.js";


export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use("/jobs", jobRouter);

  return app;
}
