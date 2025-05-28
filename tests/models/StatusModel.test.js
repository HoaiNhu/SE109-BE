const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Status = require("../../src/models/StatusModel");

let mongoServer;

beforeAll(async () => {
  jest.setTimeout(10000);
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe("Status Model Tests", () => {
  test("ST_MOD-1: Kiểm tra tạo mới Status", async () => {
    const status = new Status({
      statusCode: "TEST",
      statusName: "Test Status",
    });
    await status.save();
    expect(status.statusCode).toBe("TEST");
  });
});
