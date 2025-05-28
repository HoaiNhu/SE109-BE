// tests/models/UserModel.test.js
const mongoose = require("mongoose");
const User = require("../../src/models/UserModel");

describe("UserModel", () => {
  test("Kiểm tra schema User có các trường bắt buộc", () => {
    const user = new User({
      familyName: "Nguyen",
      userName: "Nhu",
      userPhone: "0367672694",
      userEmail: "nghoainhu1234@gmail.com",
      userPassword: "hashedPassword",
      userConfirmPassword: "hashedPassword",
      isAdmin: false,
    });

    expect(user.familyName).toBe("Nguyen");
    expect(user.userEmail).toBe("nghoainhu1234@gmail.com");
    expect(user.isAdmin).toBe(false);
  });
});
