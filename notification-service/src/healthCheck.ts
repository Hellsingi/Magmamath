import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './utils/logger';

dotenv.config();

const app = express();
app.use(cors());

app.get('/health', (_req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'Notification Service OK' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
});

