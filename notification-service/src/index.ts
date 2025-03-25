import dotenv from 'dotenv';
import { listenForMessages } from './consumer';
import './healthCheck';

dotenv.config();

listenForMessages().catch(console.error);
