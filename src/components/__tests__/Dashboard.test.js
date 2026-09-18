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

// Chart.js cannot draw on a jsdom canvas. The stub reports the series and
// category counts so the wiring assertions have something to check.
jest.mock("react-chartjs-2", () => {
  const React = require("react");
  const stub = (kind) => ({ data }) =>
    React.createElement("div", {
      "data-testid": "chart",
      "data-kind": kind,
      "data-datasets": data.datasets.map((d) => d.label).join("|"),
      "data-labelcount": String(data.labels.length),
    });
  return { Bar: stub("bar"), Line: stub("line") };
});

const openCharts = async () => {
  // Radix tab triggers activate on mouseDown, not click.
  await act(async () => {
    fireEvent.mouseDown(screen.getByRole("tab", { name: /reference charts/i }));
  });
};

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
    await openCharts();

    expect(
      screen.getByText("Reference benchmark charts (static dataset)")
    ).toBeInTheDocument();
    expect(screen.getByText("Reference dataset")).toBeInTheDocument();
    // The built-in fitnessData set covers 10 benchmark functions.
    expect(screen.getAllByTestId("chart")).toHaveLength(10);
  });

  test("defaults to today's behaviour: exponential, both selections, 10 mutations", async () => {
    await renderDashboard();
    await openCharts();

    expect(
      screen.getByRole("button", { name: "Exponential" }).className
    ).toContain("bg-accent-600");

    const [chart] = screen.getAllByTestId("chart");
    expect(chart).toHaveAttribute(
      "data-datasets",
      "exponential · STS|exponential · Greedy"
    );
    expect(chart).toHaveAttribute("data-labelcount", "10");
  });

  test("the broken all-methods option is gone", async () => {
    await renderDashboard();
    await openCharts();

    expect(screen.queryByText("All Methods")).not.toBeInTheDocument();
  });

  test("a crossover button swaps the plotted series", async () => {
    await renderDashboard();
    await openCharts();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Two-Point" }));
    });

    expect(screen.getAllByTestId("chart")[0]).toHaveAttribute(
      "data-datasets",
      "two-point · STS|two-point · Greedy"
    );
  });

  test("the GRD toggle drops the greedy series", async () => {
    await renderDashboard();
    await openCharts();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "GRD" }));
    });

    expect(screen.getAllByTestId("chart")[0]).toHaveAttribute(
      "data-datasets",
      "exponential · STS"
    );
  });

  test("Custom… opens the model selector and applying it re-plots", async () => {
    await renderDashboard();
    await openCharts();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Custom…" }));
    });

    // ui/dialog.jsx sets no role="dialog" — query by its heading text.
    expect(screen.getByText("Custom model selection")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByLabelText("Binomial Crossover"));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    });

    expect(screen.queryByText("Custom model selection")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Custom (4 series)" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("chart")[0]).toHaveAttribute(
      "data-datasets",
      "exponential · STS|exponential · Greedy|binomial · STS|binomial · Greedy"
    );
  });

  test("Top 10 collapses each chart to a single ranked series", async () => {
    await renderDashboard();
    await openCharts();

    await act(async () => {
      fireEvent.mouseDown(screen.getByRole("tab", { name: "Top 10" }));
    });

    const [chart] = screen.getAllByTestId("chart");
    expect(chart).toHaveAttribute("data-datasets", "Avg. lowest fitness");
    expect(chart).toHaveAttribute("data-labelcount", "10");

    await act(async () => {
      fireEvent.mouseDown(screen.getByRole("tab", { name: "All" }));
    });

    expect(screen.getAllByTestId("chart")[0]).toHaveAttribute(
      "data-labelcount",
      "10"
    );
    expect(screen.getAllByTestId("chart")[0]).toHaveAttribute(
      "data-datasets",
      "exponential · STS|exponential · Greedy"
    );
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
