import React from "react";
import { render, screen, act } from "@testing-library/react";
import { SimulationProvider, useSimulation } from "../SimulationContext";
import { simulationService } from "../../services/api";
import { DUMMY_SIMULATION_ID } from "../../data/dummySimulation";

jest.mock("../../services/api", () => ({
  simulationService: {
    getAll: jest.fn(),
    getResults: jest.fn(),
    delete: jest.fn(),
  },
}));

const TestConsumer = () => {
  const {
    simulations,
    loading,
    error,
    fetchSimulations,
    deleteSimulation,
    loadDummySimulation,
    removeSimulation,
  } = useSimulation();
  return (
    <div>
      <span data-testid="count">{simulations.length}</span>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <span data-testid="error">{error || "none"}</span>
      <span data-testid="statuses">
        {simulations
          .map((s) => `${s.id}:${s.status}:${s.progress}:${s.completedModels}`)
          .join(",")}
      </span>
      <button onClick={fetchSimulations}>Fetch</button>
      <button onClick={() => deleteSimulation("1")}>Delete</button>
      <button onClick={loadDummySimulation}>Dummy</button>
      <button onClick={() => removeSimulation(DUMMY_SIMULATION_ID)}>
        RemoveDummy
      </button>
    </div>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SimulationContext", () => {
  test("starts with empty simulations", () => {
    render(
      <SimulationProvider>
        <TestConsumer />
      </SimulationProvider>
    );
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("fetchSimulations loads data from API", async () => {
    const mockData = [
      { id: "1", model: "DE/best/1", benchmark: "Sphere" },
      { id: "2", model: "DE/rand/1", benchmark: "Ackley" },
    ];
    simulationService.getAll.mockResolvedValue({ data: mockData });

    await act(async () => {
      render(
        <SimulationProvider>
          <TestConsumer />
        </SimulationProvider>
      );
    });

    await act(async () => {
      screen.getByText("Fetch").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  test("deleteSimulation removes from list", async () => {
    const mockData = [
      { id: "1", model: "DE/best/1", benchmark: "Sphere" },
      { id: "2", model: "DE/rand/1", benchmark: "Ackley" },
    ];
    simulationService.getAll.mockResolvedValue({ data: mockData });
    simulationService.delete.mockResolvedValue({ data: {} });

    await act(async () => {
      render(
        <SimulationProvider>
          <TestConsumer />
        </SimulationProvider>
      );
    });

    await act(async () => {
      screen.getByText("Fetch").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("2");

    await act(async () => {
      screen.getByText("Delete").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("fetchSimulations surfaces the error instead of silently swapping in mock data", async () => {
    simulationService.getAll.mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(
        <SimulationProvider>
          <TestConsumer />
        </SimulationProvider>
      );
    });

    await act(async () => {
      screen.getByText("Fetch").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("error").textContent).toContain("Network error");
  });

  describe("dummy demo simulation", () => {
    const renderAnd = async (clicks = []) => {
      await act(async () => {
        render(
          <SimulationProvider>
            <TestConsumer />
          </SimulationProvider>
        );
      });
      for (const label of clicks) {
        await act(async () => {
          screen.getByText(label).click();
        });
      }
    };

    test("loadDummySimulation adds a completed local run without calling the API", async () => {
      await renderAnd(["Dummy"]);
      expect(screen.getByTestId("count").textContent).toBe("1");
      expect(screen.getByTestId("statuses").textContent).toContain(
        `${DUMMY_SIMULATION_ID}:completed:100:800`
      );
      expect(simulationService.getAll).not.toHaveBeenCalled();
    });

    test("reloading the dummy run replaces it instead of duplicating", async () => {
      await renderAnd(["Dummy", "Dummy"]);
      expect(screen.getByTestId("count").textContent).toBe("1");
    });

    test("removeSimulation clears the dummy run locally", async () => {
      await renderAnd(["Dummy", "RemoveDummy"]);
      expect(screen.getByTestId("count").textContent).toBe("0");
    });
  });

  describe("live progress polling", () => {
    const runningSim = {
      _id: "1",
      status: "running",
      progress: 20,
      completedModels: 5,
      totalModels: 24,
      functions: [1],
      methods: { mutation: [1], crossover: [1], selection: [1] },
      createdAt: "2026-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("polls active simulations every 5s and merges live progress", async () => {
      simulationService.getAll.mockResolvedValue({ data: [runningSim] });
      simulationService.getResults.mockResolvedValue({
        data: {
          status: "running",
          progress: 50,
          completedModels: 12,
          simulationData: [],
        },
      });

      await act(async () => {
        render(
          <SimulationProvider>
            <TestConsumer />
          </SimulationProvider>
        );
      });

      await act(async () => {
        screen.getByText("Fetch").click();
      });

      // The context kicks off an immediate first poll when active sims appear.
      expect(simulationService.getResults).toHaveBeenCalledTimes(1);
      expect(simulationService.getResults).toHaveBeenCalledWith("1");

      // Advance one 5s interval: progress should advance to 50/12.
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });
      expect(simulationService.getResults).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId("statuses").textContent).toContain(
        "1:running:50:12"
      );
    });

    test("stops polling once a simulation reaches a terminal state", async () => {
      simulationService.getAll.mockResolvedValue({ data: [runningSim] });
      simulationService.getResults.mockResolvedValue({
        data: {
          status: "completed",
          progress: 100,
          completedModels: 24,
          simulationData: [{ lowestFitness: 0.00000000123 }],
        },
      });

      await act(async () => {
        render(
          <SimulationProvider>
            <TestConsumer />
          </SimulationProvider>
        );
      });

      await act(async () => {
        screen.getByText("Fetch").click();
      });

      // First (immediate) poll flips the sim to completed.
      await act(async () => {
        jest.advanceTimersByTime(0);
      });
      expect(screen.getByTestId("statuses").textContent).toContain(
        "1:completed:100:24"
      );

      // No active sims left -> the interval must be cleared, no more polls.
      const callsAfterTerminal = simulationService.getResults.mock.calls.length;
      await act(async () => {
        jest.advanceTimersByTime(20000);
      });
      expect(simulationService.getResults.mock.calls.length).toBe(
        callsAfterTerminal
      );
    });
  });
});
