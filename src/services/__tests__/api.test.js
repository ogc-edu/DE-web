jest.mock("axios", () => {
  const mockAxios = {
    interceptors: {
      request: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      create: () => mockAxios,
    },
    ...mockAxios,
  };
});

const axios = require("axios").default;
const mockInstance = axios.create();

const { authService, simulationService, adminService } = require("../api");

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("authService", () => {
  test("login calls POST /api/v1/login", () => {
    const credentials = { email: "test@test.com", password: "pass" };
    authService.login(credentials);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/login", credentials);
  });

  test("register calls POST /api/v1/register", () => {
    const userData = { username: "Test", email: "test@test.com", password: "pass" };
    authService.register(userData);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/register", userData);
  });

  test("verifyToken calls POST /api/v1/verify", () => {
    authService.verifyToken();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/verify");
  });

  test("getProfile calls GET /api/v1/user/profile", () => {
    authService.getProfile();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/v1/user/profile");
  });

  test("updateProfile calls PATCH /api/v1/user/profile", () => {
    const userData = { username: "Updated" };
    authService.updateProfile(userData);
    expect(mockInstance.patch).toHaveBeenCalledWith("/api/v1/user/profile", userData);
  });

  test("changePassword calls PATCH /api/v1/user/password", () => {
    const data = { currentPassword: "old", newPassword: "newpass" };
    authService.changePassword(data);
    expect(mockInstance.patch).toHaveBeenCalledWith("/api/v1/user/password", data);
  });

  test("logout calls POST /api/v1/logout", () => {
    authService.logout();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/logout");
  });

  test("refreshToken calls POST /api/v1/refresh", () => {
    authService.refreshToken();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/refresh");
  });
});

describe("simulationService", () => {
  test("getAll calls GET /api/v1/simulation/get and unwraps simulations", async () => {
    mockInstance.get.mockResolvedValue({
      data: { simulations: [{ _id: "123" }], simulationCount: 1 },
    });
    const response = await simulationService.getAll();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/v1/simulation/get");
    expect(response.data).toEqual([{ _id: "123" }]);
  });

  test("getById calls GET /api/v1/simulation/get/:id", () => {
    simulationService.getById("123");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/v1/simulation/get/123");
  });

  test("getResults calls GET /api/v1/simulation/get/:id/results", () => {
    simulationService.getResults("123");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/v1/simulation/get/123/results");
  });

  test("create calls POST /api/v1/simulation/create", () => {
    const data = { functions: [1], methods: { mutation: [1], crossover: [1], selection: [1] } };
    simulationService.create(data);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/simulation/create", data);
  });

  test("importFile calls POST /api/v1/simulation/import", () => {
    const payload = { content: "model\tbenchmark\tlowestFitness", filename: "data.txt" };
    simulationService.importFile(payload);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/v1/simulation/import", payload);
  });

  test("delete calls DELETE /api/v1/simulation/delete/:id", () => {
    simulationService.delete("123");
    expect(mockInstance.delete).toHaveBeenCalledWith("/api/v1/simulation/delete/123");
  });
});

describe("adminService", () => {
  test("getQueueStatus calls GET /api/v1/admin/queue", () => {
    adminService.getQueueStatus();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/v1/admin/queue");
  });
});
