import { createClient } from 'redis';
import { config } from './index';
import logger from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;

export const connectRedis = async (): Promise<void> => {
  // Skip Redis in development if not explicitly enabled
  if (config.env === 'development' && process.env.ENABLE_REDIS !== 'true') {
    logger.info('Redis disabled in development mode');
    return;
  }

  try {
    redisClient = createClient({
      url: config.redis.url,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection failed, continuing without cache:', error);
    redisClient = null;
  }
};

export default redisClient;

