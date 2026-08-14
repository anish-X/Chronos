import { pool } from "../db/client.js"
import { createJob } from "../lib/types.js"

export async function createJob(data: createJob) {
  const result = await pool.query(
    `INSERT INTO job_definition (name, default_config, handler) 
    VALUES ($1, $2, $3)
    RETURNING * `,
    [data.name, data.defaultConfig, data.handler]
  )

  return result.rows[0]
}

export async function getJobs() {
  const result = await pool.query(`
    SELECT *
    FROM job_definition
    ORDER BY created_at DESC
  `);

  return result.rows;
}
