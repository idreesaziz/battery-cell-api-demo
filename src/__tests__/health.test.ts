import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /docs", () => {
  it("should serve Swagger UI", async () => {
    const res = await request(app).get("/docs/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger");
  });
});
