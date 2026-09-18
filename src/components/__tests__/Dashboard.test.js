import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Dashboard from "../Dashboard";

// SimulationsTable pulls result rows lazily through this service.
jest.mock("../../services/api", () => ({
  simulationService: { getResults: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => mockNavigate,
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
  loadDummySimulation: jest.fn(),
  removeSimulation: jest.fn(),
};
jest.mock("../../context/SimulationContext", () => ({
  useSimulation: () => mockSimulation,
}));

// Chart.js cannot draw on a jsdom canvas; the reference-chart tab only needs to
// prove it swapped views.
jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
}));

const sim = (over = {}) => ({
  id: "sim-1",
  status: "completed",
  timestamp: "2026-01-02T03:04:05.000Z",
  modelSummary: "DE/rand/1",
  benchmark: "Sphere Function",
  functionNames: ["Sphere Function"],
  bestFitness: 1e-8,
  np: 20,
  f: 0.5,
  cr: 0.9,
  simulationData: [],
  ...over,
});

const renderDashboard = async () => {
  await act(async () => {
    render(<Dashboard />);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSimulation.simulations = [];
  mockSimulation.loading = false;
  mockSimulation.error = null;
});

describe("Dashboard", () => {
  test("renders the heading and loads simulations on mount", async () => {
    await renderDashboard();

    expect(screen.getByText("Research Dashboard")).toBeInTheDocument();
    expect(mockSimulation.fetchSimulations).toHaveBeenCalled();
  });

  test("stat tiles derive from the simulation list", async () => {
    mockSimulation.simulations = [
      sim({ bestFitness: 1e-8 }),
      sim({ id: "sim-2", status: "running", bestFitness: 3e-8 }),
      sim({ id: "sim-3", status: "pending", bestFitness: null }),
    ];

    await renderDashboard();

    expect(screen.getByText("Total Simulations").nextSibling).toHaveTextContent(
      "3"
    );
    // Two of the three are pending/running.
    expect(screen.getByText("Active Jobs").nextSibling).toHaveTextContent("2");
    // Mean of the two finite values, in exponential notation.
    expect(screen.getByText("Avg. Best Fitness").nextSibling).toHaveTextContent(
      "2.0000e-8"
    );
  });

  test("reports N/A for average fitness when nothing has a result yet", async () => {
    mockSimulation.simulations = [sim({ bestFitness: null })];

    await renderDashboard();

    expect(screen.getByText("Avg. Best Fitness").nextSibling).toHaveTextContent(
      "N/A"
    );
  });

  test("defaults to the table view", async () => {
    mockSimulation.simulations = [sim()];

    await renderDashboard();

    expect(screen.getByText("Your simulation runs")).toBeInTheDocument();
    expect(screen.getByText("DE/rand/1")).toBeInTheDocument();
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });

  test("the reference-charts tab labels itself as a static dataset", async () => {
    await renderDashboard();

    // Radix tab triggers activate on mouseDown, not click.
    await act(async () => {
      fireEvent.mouseDown(screen.getByRole("tab", { name: /reference charts/i }));
    });

    expect(
      screen.getByText("Reference benchmark charts (static dataset)")
    ).toBeInTheDocument();
    expect(screen.getByText("Reference dataset")).toBeInTheDocument();
    // The built-in fitnessData set covers 10 benchmark functions.
    expect(screen.getAllByTestId("chart").length).toBeGreaterThan(0);
  });

  test("surfaces a backend error instead of pretending the list is empty", async () => {
    mockSimulation.error = "Network Error";

    await renderDashboard();

    expect(screen.getByText("Failed to load simulations")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });

  test("shows a loading state on the first fetch", async () => {
    mockSimulation.loading = true;

    await renderDashboard();

    expect(screen.getByText("Loading simulations...")).toBeInTheDocument();
  });

  test("the header buttons route to the simulator and import pages", async () => {
    // With a row present the table's own empty-state CTAs stay out of the way,
    // so these two names are unambiguous.
    mockSimulation.simulations = [sim()];
    await renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: /new simulation/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/api/simulator");

    fireEvent.click(screen.getByRole("button", { name: /^import data$/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/api/import");
  });

  test("the 'Use dummy data' button loads the local demo run", async () => {
    await renderDashboard();

    fireEvent.click(
      screen.getByRole("button", { name: /use dummy data/i })
    );
    expect(mockSimulation.loadDummySimulation).toHaveBeenCalledTimes(1);
  });
});
