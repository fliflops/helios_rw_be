import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
import apiLogger from './api/middleware/api.logger.middleware';
import errorLoggerMiddleware from './api/middleware/error.logger.middleware';
import heliosDB from './database/helios';
import router from './api';
import redis from './utils/redis';
import helmet from 'helmet';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware to parse JSON bodies
app.use(express.json());
app.use(helmet())
app.use(cors())

app.use(apiLogger);
app.use(router);

// Basic route
app.get('/api/hello', (req: Request, res: Response) => {
  logger.info('Received request for /api/hello');
  res.status(200).json({ message: 'Hello from Node.js TypeScript App!' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  logger.info('Health check requested.');
  res.status(200).send('OK');
});

app.use(errorLoggerMiddleware)

//load database
const loadDBs = async() => {
  await heliosDB.authenticate().then(() => logger.info('Connected to Helios DB'))
  await redis.connect().then(() => logger.info('Connected to redis'));
}

loadDBs();

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});