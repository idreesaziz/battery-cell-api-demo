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
 * GET /cells — return all battery cells.
 */
export const getAllCells = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cells = await repo().find({ order: { createdAt: "DESC" } });
    res.json(cells);
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
