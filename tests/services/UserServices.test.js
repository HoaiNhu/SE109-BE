// tests/services/UserServices.test.js
const UserServices = require("../../src/services/UserServices");
const User = require("../../src/models/UserModel");
const bcrypt = require("bcrypt");
const JwtService = require("../../src/services/JwtService");

jest.mock("../../src/models/UserModel");
jest.mock("../../src/services/JwtService");

describe("UserServices - loginUser", () => {
  test("Kiểm tra logic đăng nhập thành công", async () => {
    const loginData = { userEmail: "test@gmail.com", userPassword: "123456" };
    const mockUser = {
      id: "user123",
      userPassword: bcrypt.hashSync("123456", 10),
      isAdmin: false,
    };

    User.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compareSync").mockReturnValue(true);
    JwtService.generalAccessToken.mockResolvedValue("mock-access-token");
    JwtService.generalRefreshToken.mockResolvedValue("mock-refresh-token");

    const response = await UserServices.loginUser(loginData);
    expect(response).toEqual({
      status: "OK",
      message: "Login successful",
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
    });
  });
});
