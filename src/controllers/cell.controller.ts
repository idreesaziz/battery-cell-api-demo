import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Like } from "typeorm";
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

    const { serialNumber, voltage, temperature, stateOfCharge, stateOfHealth, cycleCount } =
      req.body;

    const cell = repo().create({
      serialNumber,
      voltage,
      temperature,
      stateOfCharge,
      stateOfHealth,
      cycleCount: cycleCount ?? 0,
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

    const allowedSortFields = ["serialNumber", "voltage", "temperature", "stateOfCharge", "stateOfHealth", "cycleCount", "createdAt", "updatedAt"] as const;
    const sortBy = allowedSortFields.includes(req.query.sortBy as any)
      ? (req.query.sortBy as string)
      : "createdAt";
    const order = (req.query.order as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const where: Record<string, any> = {};
    if (req.query.serialNumber) {
      where.serialNumber = Like(`%${req.query.serialNumber as string}%`);
    }

    const [cells, total] = await repo().findAndCount({
      where,
      order: { [sortBy]: order },
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
 * GET /cells/stats — return aggregate statistics for all battery cells.
 */
export const getCellStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await repo()
      .createQueryBuilder("cell")
      .select([
        "COUNT(*)::int AS \"totalCells\"",
        "ROUND(AVG(cell.voltage)::numeric, 2) AS \"avgVoltage\"",
        "ROUND(AVG(cell.temperature)::numeric, 2) AS \"avgTemperature\"",
        "ROUND(AVG(cell.state_of_charge)::numeric, 2) AS \"avgStateOfCharge\"",
        "ROUND(AVG(cell.state_of_health)::numeric, 2) AS \"avgStateOfHealth\"",
        "ROUND(AVG(cell.cycle_count)::numeric, 2) AS \"avgCycleCount\"",
        "MIN(cell.voltage) AS \"minVoltage\"",
        "MAX(cell.voltage) AS \"maxVoltage\"",
        "MIN(cell.temperature) AS \"minTemperature\"",
        "MAX(cell.temperature) AS \"maxTemperature\"",
      ])
      .getRawOne();

    res.json(stats);
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
    const id = req.params.id as string;
    const cell = await repo().findOneBy({ id });
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

    const id = req.params.id as string;
    const cell = await repo().findOneBy({ id });
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
    const id = req.params.id as string;
    const result = await repo().delete(id);
    if (result.affected === 0) {
      res.status(404).json({ message: "Battery cell not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
