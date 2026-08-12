import { Pool } from 'pg';
import { config } from '../config';

//Pool manages multiple open connection to the database
//when there is some query to the db, it grabs an open/available connection
//runs the query and retruns the connection back to the pool,
//no need to close or open the connection manually 
export const pool = new Pool({
  connectionString: config.database.url,
  max: 10,
  idleTimeoutMillis: 30_000,
})


export async function connectDB(): Promise<void> {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT NOW()');
    console.log(`postgres connected at ${result.rows[0].now}`);
  } finally {
    client.release(); // release the connection back to the pool
  }
}

// Clean shutdown - close all connection
export async function disconnectDB(): Promise<void> {
  await pool.end();
  console.log('Postgres disconnected');
}
