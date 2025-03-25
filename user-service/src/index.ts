import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import healthRoutes from "./routes/health.routes";
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

// app.use('/api/users', userRoutes);
app.use("/health", healthRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });
  })
  .catch((err) => logger.error("MongoDB connection error: %s", err));

app.use(errorMiddleware);
