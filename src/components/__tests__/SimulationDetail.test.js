import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SimulationDetail from "../SimulationDetail";
import { simulationService } from "../../services/api";

jest.mock("../../services/api", () => ({
  simulationService: {
    getResults: jest.fn(),
    getById: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "sim-1" }),
}));

const mockAuth = {
  user: { role: "user", name: "Ada", email: "ada@test.com" },
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

const mockSimulation = {
  deleteSimulation: jest.fn(),
  fetchSimulations: jest.fn(),
};
jest.mock("../../context/SimulationContext", () => ({
  useSimulation: () => mockSimulation,
}));

const results = (over = {}) => ({
  data: {
    simulationId: "sim-1",
    status: "completed",
    totalModels: 2,
    completedModels: 2,
    progress: 100,
    simulationData: [
      {
        functionId: 5,
        mutationId: 1,
        crossoverId: 2,
        selectionId: 1,
        lowestFitness: 1.5e-8,
      },
      {
        functionId: 5,
        mutationId: 4,
        crossoverId: 2,
        selectionId: 1,
        lowestFitness: 2.5e-8,
      },
    ],
    ...over,
  },
});

const detail = (over = {}) => ({
  data: {
    simulation: {
      _id: "sim-1",
      np: 20,
      f: 0.5,
      cr: 0.9,
      gen: 1000,
      dim: 30,
      functions: [5],
      methods: { mutation: [1, 4], crossover: [2], selection: [1] },
      createdAt: "2026-01-02T03:04:05.000Z",
      ...over,
    },
  },
});

const renderDetail = async () => {
  await act(async () => {
    render(<SimulationDetail />);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  simulationService.getResults.mockResolvedValue(results());
  simulationService.getById.mockResolvedValue(detail());
});

describe("SimulationDetail", () => {
  test("loads the simulation and shows its configuration", async () => {
    await renderDetail();

    expect(screen.getByText("Simulation details")).toBeInTheDocument();
    expect(simulationService.getResults).toHaveBeenCalledWith("sim-1");
    expect(screen.getByText("ID: sim-1")).toBeInTheDocument();
    expect(screen.getByText("20 / 0.5 / 0.9")).toBeInTheDocument();
    expect(screen.getByText("1000 / 30")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("best fitness is the minimum across result rows", async () => {
    await renderDetail();

    // min(1.5e-8, 2.5e-8) — DE minimises. Scope to the summary card, since the
    // same value also appears in its own results row.
    expect(screen.getByText("Best fitness").nextSibling).toHaveTextContent(
      "1.5000e-8"
    );
  });

  test("renders one row per result", async () => {
    await renderDetail();

    expect(screen.getByText("2 rows · lower is better")).toBeInTheDocument();
  });

  test("surfaces a load failure with a way back", async () => {
    simulationService.getResults.mockRejectedValue({
      response: { data: { message: "Simulation not found" } },
    });

    await renderDetail();

    expect(screen.getByText("Could not load simulation")).toBeInTheDocument();
    expect(screen.getByText("Simulation not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /return to dashboard/i })
    ).toHaveAttribute("href", "/api");
  });

  test("still renders when the detail endpoint fails but results succeed", async () => {
    simulationService.getById.mockRejectedValue(new Error("500"));

    await renderDetail();

    expect(screen.queryByText("Could not load simulation")).not.toBeInTheDocument();
    expect(screen.getByText("2 rows · lower is better")).toBeInTheDocument();
  });

  test("says results keep updating while a job is in flight", async () => {
    simulationService.getResults.mockResolvedValue(
      results({ status: "running", completedModels: 1, progress: 50 })
    );

    await renderDetail();

    expect(
      screen.getByText("This job is still running — results update automatically.")
    ).toBeInTheDocument();
  });

  test("export is disabled when there are no rows", async () => {
    simulationService.getResults.mockResolvedValue(
      results({ simulationData: [] })
    );

    await renderDetail();

    expect(screen.getByRole("button", { name: /export csv/i })).toBeDisabled();
  });

  test("deleting confirms, then removes and returns to the dashboard", async () => {
    mockSimulation.deleteSimulation.mockResolvedValue(true);

    await renderDetail();

    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(mockSimulation.deleteSimulation).not.toHaveBeenCalled();

    const heading = screen.getByText("Delete simulation?");
    const dialog = heading.closest("div.relative");
    await act(async () => {
      fireEvent.click(
        [...dialog.querySelectorAll("button")].find(
          (b) => b.textContent.trim() === "Delete"
        )
      );
    });

    expect(mockSimulation.deleteSimulation).toHaveBeenCalledWith("sim-1");
    expect(mockSimulation.fetchSimulations).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/api");
  });
});
