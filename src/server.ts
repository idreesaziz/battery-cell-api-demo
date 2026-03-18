import "reflect-metadata";
import { env } from "./config/env";
import { AppDataSource } from "./database/data-source";
import app from "./app";

// --------------- Start ---------------
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    const server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/docs`);
    });

    // --------------- Graceful Shutdown ---------------
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received — shutting down gracefully`);
      server.close(() => {
        console.log("HTTP server closed");
        AppDataSource.destroy()
          .then(() => {
            console.log("Database connection closed");
            process.exit(0);
          })
          .catch((err) => {
            console.error("Error closing database connection", err);
            process.exit(1);
          });
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err: Error) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
