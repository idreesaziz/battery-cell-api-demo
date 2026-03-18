import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });
});

describe("GET /docs", () => {
  it("should serve Swagger UI", async () => {
    const res = await request(app).get("/docs/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger");
  });
});
