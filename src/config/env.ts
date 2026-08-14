import dotenv from 'dotenv'
dotenv.config();

export const env = {
  database: {
    url: process.env.DATABASE_URL
  },
  redis: {
    url: process.env.REDIS_URL
  },
  api: {
    PORT: process.env.PORT,
  }
  /*
   * TODO: config for worker and scheduler services*/
}
