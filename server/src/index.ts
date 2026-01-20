import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import logger from './utils/logger';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Connect to Redis (optional)
    try {
      await connectRedis();
    } catch (error) {
      logger.warn('Redis connection failed, continuing without cache');
    }
    
    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API version: ${config.apiVersion}`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
