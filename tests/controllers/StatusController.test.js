const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const StatusController = require("../../src/controllers/StatusController");
const StatusService = require("../../src/services/StatusService");

// Mock express app
const app = express();
app.use(express.json());
app.post("/api/status/create-status", StatusController.createStatus);
app.get("/api/status/get-all-status", StatusController.getAllStatus);

// Mock StatusService
jest.mock("../../src/services/StatusService");

let mongoServer;

beforeAll(async () => {
  jest.setTimeout(10000); // Tăng timeout lên 10 giây
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  jest.setTimeout(10000);
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  jest.clearAllMocks();
});

describe("Status Controller API Tests", () => {
  test("ST_UIF-1: Kiểm tra tổng thể API trả về status 200 khi gọi endpoint", async () => {
    StatusService.getAllStatus.mockResolvedValue({
      status: "OK",
      message: "Success",
      data: [],
    });

    const res = await request(app).get("/api/status/get-all-status");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("message", "Success");
  });

  test("ST_UIF-2: Kiểm tra tạo status với dữ liệu hợp lệ", async () => {
    const statusData = { statusCode: "NEW", statusName: "New Status" };
    StatusService.createStatus.mockResolvedValue({
      status: "OK",
      message: "Status successfully created",
      data: { statusCode: "NEW", statusName: "New Status" },
    });

    const res = await request(app)
      .post("/api/status/create-status")
      .send(statusData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("message", "Status successfully created");
    expect(res.body.data).toHaveProperty("statusCode", "NEW");
  });

  test("ST_UIF-3: Kiểm tra tạo status với statusName trống", async () => {
    const statusData = { statusCode: "NEW", statusName: "" };
    StatusService.createStatus.mockRejectedValue({
      status: "ERR",
      message: "The input is required",
    });

    const res = await request(app)
      .post("/api/status/create-status")
      .send(statusData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("status", "ERR");
    expect(res.body).toHaveProperty("message", "The input is required");
  });
});
