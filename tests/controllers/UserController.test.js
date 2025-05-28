// tests/controllers/UserController.test.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const UserController = require("../../src/controllers/UserController");
const UserServices = require("../../src/services/UserServices");
const User = require("../../src/models/UserModel");

// Mock express app
const app = express();
app.use(express.json());
app.post("/log-in", UserController.loginUser);

// Mock UserServices
jest.mock("../../src/services/UserServices");

describe("UserController - loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Kiểm tra đăng nhập thành công với thông tin hợp lệ", async () => {
    // Input: Sử dụng thông tin tài khoản thực tế
    const loginData = {
      userEmail: "nghoainhu1234@gmail.com",
      userPassword: "123", // Mật khẩu gốc, sẽ được so sánh trong UserServices
    };

    // Mock UserServices.loginUser trả về thành công
    UserServices.loginUser.mockResolvedValue({
      status: "OK",
      message: "Login successful",
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
    });

    // Mô tả: Kiểm tra đăng nhập thành công, trả về access_token
    const response = await request(app).post("/log-in").send(loginData);

    // Kết quả mong đợi
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      message: "Login successful",
      access_token: "mock-access-token",
    });
    expect(response.headers["set-cookie"]).toBeDefined(); // Kiểm tra cookie refresh_token
    // Output: Pass (nếu không có lỗi "object object")
  });

  test("Kiểm tra đăng nhập thất bại với email không tồn tại", async () => {
    const loginData = {
      userEmail: "notfound@gmail.com",
      userPassword: "123456",
    };

    UserServices.loginUser.mockRejectedValue({
      status: "ERR",
      message: "User not found",
    });

    const response = await request(app).post("/log-in").send(loginData);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual({
      status: "ERR",
      message: "User not found",
    });
    // Output: Fail (lỗi "object object" thay vì thông báo rõ ràng)
  });

  test("Kiểm tra đăng nhập thất bại với mật khẩu sai", async () => {
    const loginData = {
      userEmail: "nghoainhu1234@gmail.com",
      userPassword: "wrongpassword", // Mật khẩu sai
    };

    UserServices.loginUser.mockRejectedValue({
      status: "ERR",
      message: "Incorrect password",
    });

    const response = await request(app).post("/log-in").send(loginData);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual({
      status: "ERR",
      message: "Incorrect password",
    });
    // Output: Fail (lỗi "object object" thay vì thông báo rõ ràng)
  });

  test("Kiểm tra đăng nhập với email không hợp lệ", async () => {
    const loginData = {
      userEmail: "invalid-email",
      userPassword: "123456",
    };

    const response = await request(app).post("/log-in").send(loginData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ERR",
      message: "The input is not email",
    });
    // Output: Pass
  });

  test("Kiểm tra đăng nhập với thiếu email và mật khẩu", async () => {
    const loginData = {};

    const response = await request(app).post("/log-in").send(loginData);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "ERR",
      message: "Email and password are required",
    });
    // Output: Pass
  });
});
