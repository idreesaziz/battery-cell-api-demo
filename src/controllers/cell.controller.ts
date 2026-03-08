import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../database/data-source";
import { BatteryCell } from "../entities/BatteryCell";

const repo = () => AppDataSource.getRepository(BatteryCell);

/**
 * POST /cells — create a new battery cell telemetry entry.
 */
export const createCell = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { serialNumber, voltage, temperature, stateOfCharge, stateOfHealth } =
      req.body;

    const cell = repo().create({
      serialNumber,
      voltage,
      temperature,
      stateOfCharge,
      stateOfHealth,
    });

    const saved = await repo().save(cell);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /cells — return battery cells with pagination.
 */
export const getAllCells = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [cells, total] = await repo().findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    res.json({
      data: cells,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /cells/:id — return a single cell.
 */
export const getCellById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cell = await repo().findOneBy({ id: req.params.id });
    if (!cell) {
      res.status(404).json({ message: "Battery cell not found" });
      return;
    }
    res.json(cell);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /cells/:id — update a cell.
 */
export const updateCell = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const cell = await repo().findOneBy({ id: req.params.id });
    if (!cell) {
      res.status(404).json({ message: "Battery cell not found" });
      return;
    }

    repo().merge(cell, req.body);
    const updated = await repo().save(cell);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /cells/:id — delete a cell.
 */
export const deleteCell = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await repo().delete(req.params.id);
    if (result.affected === 0) {
      res.status(404).json({ message: "Battery cell not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
