import dotenv from 'dotenv';
import logger from './utils/logger';
import { consumeMessages } from './consumer';
import './healthCheck';

dotenv.config();

consumeMessages().catch(logger.error);
