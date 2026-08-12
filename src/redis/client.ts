import { createClient } from "redis";
import { config } from '../config';


export const redis = createClient({
  url: config.redis.url,
})

//Redis client emits event for errors. Without this handler,
//an unhandled error might crash the process
redis.on('error', (err) => {
  console.log('Redis error: ', err)
})

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log('Redis connected');
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  console.log('Redis disconnected');
}
