import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import cellRoutes from "./routes/cell.routes";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";
import { apiLimiter } from "./middleware/rate-limiter";
import { correlationId } from "./middleware/correlation-id";

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(correlationId);
app.use(requestLogger);
app.use(apiLimiter);

// --------------- Swagger Docs ---------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Routes ---------------
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

app.use("/cells", cellRoutes);

// --------------- Not Found Handler ---------------
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

export default app;
