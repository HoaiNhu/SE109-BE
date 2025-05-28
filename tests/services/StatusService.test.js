const StatusService = require("../../src/services/StatusService");
const Status = require("../../src/models/StatusModel");

jest.mock("../../src/models/StatusModel");

describe("Status Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ST_SVC-1: Kiểm tra createStatus thành công", async () => {
    const statusData = { statusCode: "TEST", statusName: "Test Status" };
    Status.findOne.mockResolvedValue(null); // Mock không tìm thấy statusCode trùng
    Status.prototype.save = jest.fn().mockResolvedValue(statusData); // Mock save thành công

    const result = await StatusService.createStatus(statusData);
    expect(result.status).toBe("OK");
    expect(result.message).toBe("Status successfully created");
    expect(result.data.statusCode).toBe("TEST");
  });

  test("ST_SVC-2: Kiểm tra createStatus với statusCode đã tồn tại", async () => {
    const statusData = { statusCode: "TEST", statusName: "Test Status" };
    Status.findOne.mockResolvedValue({ statusCode: "TEST" }); // Mock statusCode đã tồn tại

    const result = await StatusService.createStatus(statusData);
    expect(result.status).toBe("OK");
    expect(result.message).toBe("The status code is already registered");
  });
});
