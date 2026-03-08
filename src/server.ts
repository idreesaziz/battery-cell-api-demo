import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { AppDataSource } from "./database/data-source";
import cellRoutes from "./routes/cell.routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Swagger Docs ---------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Routes ---------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/cells", cellRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start ---------------
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });

export default app;
