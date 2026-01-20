import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

// Routes
import authRoutes from './modules/auth/routes';
import projectRoutes from './modules/projects/routes';
import skillRoutes from './modules/skills/routes';
import experienceRoutes from './modules/experiences/routes';
import profileRoutes from './modules/profile/routes';
import educationRoutes from './modules/education/routes';
import certificationRoutes from './modules/certifications/routes';
import auditRoutes from './modules/audit/routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: [config.cors.clientUrl, config.cors.adminUrl],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Compression
app.use(compression());

// Passport
app.use(passport.initialize());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});

// API Routes
const apiVersion = config.apiVersion;

// Health check
app.get(`/api/${apiVersion}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/projects`, projectRoutes);
app.use(`/api/${apiVersion}/skills`, skillRoutes);
app.use(`/api/${apiVersion}/experiences`, experienceRoutes);
app.use(`/api/${apiVersion}/profile`, profileRoutes);
app.use(`/api/${apiVersion}/education`, educationRoutes);
app.use(`/api/${apiVersion}/certifications`, certificationRoutes);
app.use(`/api/${apiVersion}/audit`, auditRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
