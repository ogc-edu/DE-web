import React from "react";
import { render, screen, act } from "@testing-library/react";
import SimulationHistory from "../SimulationHistory";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockAuth = {
  user: { role: "user", name: "Ada", email: "ada@test.com" },
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

const mockSimulation = {
  simulations: [],
  loading: false,
  error: null,
  fetchSimulations: jest.fn(),
  deleteSimulation: jest.fn(),
};
jest.mock("../../context/SimulationContext", () => ({
  useSimulation: () => mockSimulation,
}));

const renderHistory = async () => {
  await act(async () => {
    render(<SimulationHistory />);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSimulation.simulations = [];
  mockSimulation.loading = false;
  mockSimulation.error = null;
});

describe("SimulationHistory", () => {
  test("renders the heading and fetches on mount", async () => {
    await renderHistory();

    expect(screen.getByText("Simulation History")).toBeInTheDocument();
    expect(mockSimulation.fetchSimulations).toHaveBeenCalled();
  });

  test("offers the status filter that the dashboard table omits", async () => {
    await renderHistory();

    expect(screen.getByText("All Statuses")).toBeInTheDocument();
  });

  test("lists the simulations it is given", async () => {
    mockSimulation.simulations = [
      {
        id: "sim-1",
        status: "failed",
        modelSummary: "DE/best/2",
        benchmark: "Ackley Function",
        functionNames: ["Ackley Function"],
        bestFitness: null,
        timestamp: "2026-01-02T03:04:05.000Z",
      },
    ];

    await renderHistory();

    expect(screen.getByText("DE/best/2")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  test("surfaces a backend error", async () => {
    mockSimulation.error = "Network Error";

    await renderHistory();

    expect(screen.getByText("Failed to load simulations")).toBeInTheDocument();
  });
});
