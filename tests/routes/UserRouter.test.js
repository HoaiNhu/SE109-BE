// tests/routes/UserRouter.test.js
const request = require("supertest");
const express = require("express");
const router = require("../../src/routes/UserRouter");

const app = express();
app.use(express.json());
app.use(router);

describe("UserRouter - /log-in", () => {
  test("Kiểm tra route /log-in tồn tại và trả về status 200 với dữ liệu hợp lệ", async () => {
    const loginData = { userEmail: "test@gmail.com", userPassword: "123456" };
    jest
      .spyOn(require("../../src/services/UserServices"), "loginUser")
      .mockResolvedValue({
        status: "OK",
        message: "Login successful",
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
      });

    const response = await request(app).post("/log-in").send(loginData);
    expect(response.status).toBe(200);
  });
});
