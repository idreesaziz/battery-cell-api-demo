import request from "supertest";
import app from "../app";

describe("GET /unknown-route", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/this-does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Route not found" });
  });
});

describe("POST /cells", () => {
  it("should return 400 when serialNumber is missing", async () => {
    const res = await request(app).post("/cells").send({
      voltage: 3.72,
      temperature: 28.5,
      stateOfCharge: 87.3,
      stateOfHealth: 99.1,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("should return 400 when voltage is negative", async () => {
    const res = await request(app).post("/cells").send({
      serialNumber: "CELL-TEST-001",
      voltage: -1,
      temperature: 28.5,
      stateOfCharge: 87.3,
      stateOfHealth: 99.1,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 when stateOfCharge exceeds 100", async () => {
    const res = await request(app).post("/cells").send({
      serialNumber: "CELL-TEST-002",
      voltage: 3.72,
      temperature: 28.5,
      stateOfCharge: 150,
      stateOfHealth: 99.1,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 when stateOfHealth is below 0", async () => {
    const res = await request(app).post("/cells").send({
      serialNumber: "CELL-TEST-003",
      voltage: 3.72,
      temperature: 28.5,
      stateOfCharge: 87.3,
      stateOfHealth: -5,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 when cycleCount is negative", async () => {
    const res = await request(app).post("/cells").send({
      serialNumber: "CELL-TEST-004",
      voltage: 3.72,
      temperature: 28.5,
      stateOfCharge: 87.3,
      stateOfHealth: 99.1,
      cycleCount: -10,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /cells/:id", () => {
  it("should return 400 for invalid UUID", async () => {
    const res = await request(app).get("/cells/not-a-uuid");

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PATCH /cells/:id", () => {
  it("should return 400 for invalid UUID", async () => {
    const res = await request(app)
      .patch("/cells/not-a-uuid")
      .send({ voltage: 3.85 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 when voltage is negative", async () => {
    const res = await request(app)
      .patch("/cells/a1b2c3d4-e5f6-7890-abcd-ef1234567890")
      .send({ voltage: -1 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("DELETE /cells/:id", () => {
  it("should return 400 for invalid UUID", async () => {
    const res = await request(app).delete("/cells/not-a-uuid");

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /cells/batch", () => {
  it("should return 400 when array items have invalid data", async () => {
    const res = await request(app)
      .post("/cells/batch")
      .send([
        {
          serialNumber: "",
          voltage: -1,
          temperature: 28.5,
          stateOfCharge: 200,
          stateOfHealth: 99.1,
        },
      ]);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
