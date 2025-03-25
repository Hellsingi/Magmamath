import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import healthRoutes from "./routes/health.routes";
import userRoutes from './routes/userRoutes';
import { errorMiddleware } from "./utils/errorMiddleware";
import logger from "./utils/logger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  logger.info("%s %s", req.method, req.url);
  next();
});

app.use('/api/', userRoutes);
app.use("/health", healthRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/users';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });
  })
  .catch((err) => logger.error("MongoDB connection error: %s", err));

