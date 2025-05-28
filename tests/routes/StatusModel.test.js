const request = require("supertest");
const express = require("express");
const StatusRouter = require("../../src/routes/StatusRouter");

const app = express();
app.use("/api/status", StatusRouter);

describe("Status Router Tests", () => {
  test("ST_RTE-1: Kiểm tra route get-all-status", async () => {
    const res = await request(app)
      .get("/api/status/get-all-status")
      .set("Authorization", "Bearer mock-token"); // Thêm token giả lập
    expect(res.status).toBe(200);
  });
});
