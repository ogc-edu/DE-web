import React from "react";
import { render, screen, act } from "@testing-library/react";
import { SimulationProvider, useSimulation } from "../SimulationContext";
import { simulationService } from "../../services/api";

jest.mock("../../services/api", () => ({
  simulationService: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

const TestConsumer = () => {
  const { simulations, loading, fetchSimulations, deleteSimulation } = useSimulation();
  return (
    <div>
      <span data-testid="count">{simulations.length}</span>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <button onClick={fetchSimulations}>Fetch</button>
      <button onClick={() => deleteSimulation("1")}>Delete</button>
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

  test("fetchSimulations falls back to mock data on error", async () => {
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

    expect(Number(screen.getByTestId("count").textContent)).toBeGreaterThan(0);
  });
});
