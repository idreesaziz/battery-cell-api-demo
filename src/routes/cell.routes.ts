import { Router } from "express";
import {
  createCell,
  getAllCells,
  getCellById,
  deleteCell,
} from "../controllers/cell.controller";
import {
  createCellValidation,
  idParamValidation,
} from "./cell.validators";

const router = Router();

/**
 * @openapi
 * /cells:
 *   post:
 *     summary: Create a new battery cell telemetry entry
 *     tags: [Battery Cells]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBatteryCellInput'
 *           example:
 *             serialNumber: "CELL-2024-00042"
 *             voltage: 3.72
 *             temperature: 28.5
 *             stateOfCharge: 87.3
 *             stateOfHealth: 99.1
 *     responses:
 *       201:
 *         description: Battery cell created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatteryCell'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", createCellValidation, createCell);

/**
 * @openapi
 * /cells:
 *   get:
 *     summary: Return all battery cells
 *     tags: [Battery Cells]
 *     responses:
 *       200:
 *         description: List of battery cells
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BatteryCell'
 */
router.get("/", getAllCells);

/**
 * @openapi
 * /cells/{id}:
 *   get:
 *     summary: Return a single battery cell by ID
 *     tags: [Battery Cells]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Battery cell UUID
 *     responses:
 *       200:
 *         description: Battery cell found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatteryCell'
 *       404:
 *         description: Battery cell not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get("/:id", idParamValidation, getCellById);

/**
 * @openapi
 * /cells/{id}:
 *   delete:
 *     summary: Delete a battery cell entry
 *     tags: [Battery Cells]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Battery cell UUID
 *     responses:
 *       204:
 *         description: Battery cell deleted
 *       404:
 *         description: Battery cell not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.delete("/:id", idParamValidation, deleteCell);

export default router;
