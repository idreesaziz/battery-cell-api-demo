import { Router } from "express";
import {
  createCell,
  getAllCells,
  getCellById,
  updateCell,
  deleteCell,
} from "../controllers/cell.controller";
import {
  createCellValidation,
  updateCellValidation,
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
 *     summary: Return battery cells (paginated)
 *     tags: [Battery Cells]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [serialNumber, voltage, temperature, stateOfCharge, stateOfHealth, cycleCount, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of battery cells
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BatteryCell'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
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
 *   patch:
 *     summary: Update a battery cell entry
 *     tags: [Battery Cells]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Battery cell UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBatteryCellInput'
 *           example:
 *             voltage: 3.85
 *             temperature: 30.2
 *     responses:
 *       200:
 *         description: Battery cell updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatteryCell'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Battery cell not found
 */
router.patch("/:id", [...idParamValidation, ...updateCellValidation], updateCell);

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
