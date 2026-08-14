import { Router } from 'express';
import { getJob, createJob, getJobById } from '../controllers/jobs.controller.js'

const router = Router();

router.get('/', getJob);
router.get('/:id', getJobById);
router.post('/', createJob);

export default router;
