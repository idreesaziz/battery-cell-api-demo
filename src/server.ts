import "reflect-metadata";
import { env } from "./config/env";
import { AppDataSource } from "./database/data-source";
import app from "./app";

// --------------- Start ---------------
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/docs`);
    });
  })
  .catch((err: Error) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
