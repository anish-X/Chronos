import { Request, Response } from "express";

import * as jobService from "../../services/jobs.service.js";

export async function createJob(req: Request, res: Response) {
  const jobData = req.body;

  const job = await jobService.createJob(jobData);
  res.status(201).json(job);
}

export async function getJob(req: Request, res: Response) {
  const job = await jobService.getJobs();
  res.status(200).json(job)
}

export async function getJobById(req: Request, res: Response) {
  res.json({ message: 'get job by id' })
}
