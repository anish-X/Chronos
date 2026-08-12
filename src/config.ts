import dotenv from 'dotenv'
dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL
  },
  redis: {
    url: process.env.REDIS_URL
  }
  /*
   * TODO: config for worker and scheduler services*/
}
