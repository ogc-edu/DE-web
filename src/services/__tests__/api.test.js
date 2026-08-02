jest.mock("axios", () => {
  const mockAxios = {
    interceptors: {
      request: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
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

const { authService, simulationService } = require("../api");

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("authService", () => {
  test("login calls POST /api/login", () => {
    const credentials = { email: "test@test.com", password: "pass" };
    authService.login(credentials);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/login", credentials);
  });

  test("register calls POST /api/register", () => {
    const userData = { name: "Test", email: "test@test.com", password: "pass", affiliation: "Uni" };
    authService.register(userData);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/register", userData);
  });

  test("verifyToken calls POST /api/auth/verify", () => {
    authService.verifyToken();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/auth/verify");
  });

  test("updateProfile calls PUT /api/user/profile", () => {
    const userData = { name: "Updated" };
    authService.updateProfile(userData);
    expect(mockInstance.put).toHaveBeenCalledWith("/api/user/profile", userData);
  });
});

describe("simulationService", () => {
  test("getAll calls GET /api/simulations", () => {
    simulationService.getAll();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/simulations");
  });

  test("getById calls GET /api/simulations/:id", () => {
    simulationService.getById("123");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/simulations/123");
  });

  test("create calls POST /api/simulations", () => {
    const data = { benchmarks: ["Sphere"], np: 15 };
    simulationService.create(data);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/simulations", data);
  });

  test("delete calls DELETE /api/simulations/:id", () => {
    simulationService.delete("123");
    expect(mockInstance.delete).toHaveBeenCalledWith("/api/simulations/123");
  });
});
