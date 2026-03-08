import { Request, Response, NextFunction } from "express";

/**
 * Global error-handling middleware.
 * Catches unhandled errors thrown in route handlers and returns a
 * consistent JSON error response.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("[Error]", err.message);

  // Handle TypeORM unique-constraint violations (PostgreSQL code 23505)
  if ((err as any).code === "23505") {
    res.status(409).json({ message: "A record with that value already exists" });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
