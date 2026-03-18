import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import cellRoutes from "./routes/cell.routes";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";
import { apiLimiter } from "./middleware/rate-limiter";

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(apiLimiter);

// --------------- Swagger Docs ---------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Routes ---------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/cells", cellRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

export default app;
