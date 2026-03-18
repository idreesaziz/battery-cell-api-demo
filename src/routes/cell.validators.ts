import { body, param } from "express-validator";

export const createCellValidation = [
  body("serialNumber")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("serialNumber is required"),
  body("voltage")
    .isFloat({ min: 0 })
    .withMessage("voltage must be a non-negative number"),
  body("temperature")
    .isFloat()
    .withMessage("temperature must be a number"),
  body("stateOfCharge")
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfCharge must be between 0 and 100"),
  body("stateOfHealth")
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfHealth must be between 0 and 100"),
  body("cycleCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("cycleCount must be a non-negative integer"),
];

export const batchCreateCellValidation = [
  body("*.serialNumber")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("serialNumber is required"),
  body("*.voltage")
    .isFloat({ min: 0 })
    .withMessage("voltage must be a non-negative number"),
  body("*.temperature")
    .isFloat()
    .withMessage("temperature must be a number"),
  body("*.stateOfCharge")
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfCharge must be between 0 and 100"),
  body("*.stateOfHealth")
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfHealth must be between 0 and 100"),
  body("*.cycleCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("cycleCount must be a non-negative integer"),
];

export const updateCellValidation = [
  body("voltage")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("voltage must be a non-negative number"),
  body("temperature")
    .optional()
    .isFloat()
    .withMessage("temperature must be a number"),
  body("stateOfCharge")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfCharge must be between 0 and 100"),
  body("stateOfHealth")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("stateOfHealth must be between 0 and 100"),
  body("cycleCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("cycleCount must be a non-negative integer"),
];

export const idParamValidation = [
  param("id").isUUID().withMessage("id must be a valid UUID"),
];
