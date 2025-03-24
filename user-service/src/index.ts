import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => app.listen(PORT, () => console.log(`User Service running on port ${PORT}`)))
  .catch(err => console.error(err));
