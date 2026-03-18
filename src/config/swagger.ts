import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Battery Cell Telemetry API",
      version: "1.0.0",
      description:
        "REST API for recording and querying battery cell telemetry data. " +
        "Simulates a backend service used in EV battery monitoring systems.",
      contact: {
        name: "API Support",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Local development server",
        variables: {
          port: {
            default: "3000",
          },
        },
      },
    ],
    components: {
      schemas: {
        BatteryCell: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            },
            serialNumber: {
              type: "string",
              example: "CELL-2024-00042",
            },
            voltage: {
              type: "number",
              format: "float",
              example: 3.72,
            },
            temperature: {
              type: "number",
              format: "float",
              example: 28.5,
            },
            stateOfCharge: {
              type: "number",
              format: "float",
              example: 87.3,
            },
            stateOfHealth: {
              type: "number",
              format: "float",
              example: 99.1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-01T14:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-01T15:00:00.000Z",
            },
          },
        },
        CreateBatteryCellInput: {
          type: "object",
          required: [
            "serialNumber",
            "voltage",
            "temperature",
            "stateOfCharge",
            "stateOfHealth",
          ],
          properties: {
            serialNumber: {
              type: "string",
              example: "CELL-2024-00042",
            },
            voltage: {
              type: "number",
              format: "float",
              minimum: 0,
              example: 3.72,
            },
            temperature: {
              type: "number",
              format: "float",
              example: 28.5,
            },
            stateOfCharge: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 100,
              example: 87.3,
            },
            stateOfHealth: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 100,
              example: 99.1,
            },
          },
        },
        UpdateBatteryCellInput: {
          type: "object",
          properties: {
            voltage: {
              type: "number",
              format: "float",
              minimum: 0,
              example: 3.85,
            },
            temperature: {
              type: "number",
              format: "float",
              example: 30.2,
            },
            stateOfCharge: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 100,
              example: 91.0,
            },
            stateOfHealth: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 100,
              example: 98.5,
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", example: "field" },
                  msg: { type: "string", example: "voltage must be a non-negative number" },
                  path: { type: "string", example: "voltage" },
                  location: { type: "string", example: "body" },
                },
              },
            },
          },
        },
        NotFoundError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Battery cell not found",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
