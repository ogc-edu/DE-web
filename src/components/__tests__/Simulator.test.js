import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Simulator from "../Simulator";
import { SimulationProvider } from "../../context/SimulationContext";
import { AuthProvider } from "../../context/AuthContext";
import { simulationService } from "../../services/api";

jest.mock("../../services/api", () => ({
  simulationService: {
    getAll: jest.fn().mockResolvedValue({ data: [] }),
    getResults: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

const renderSimulator = () =>
  render(
    <AuthProvider>
      <SimulationProvider>
        <Simulator />
      </SimulationProvider>
    </AuthProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe("Simulator", () => {
  test("submits the real DE params (np, f, cr, gen, dim) in the create body", async () => {
    simulationService.create.mockResolvedValue({
      data: { simulationId: "abc", queued: true },
    });

    renderSimulator();

    // Page 1 — numeric parameters (change population to prove number parsing).
    fireEvent.change(screen.getByLabelText(/Number of Population/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/Scaling Factor/i), {
      target: { value: "0.7" },
    });
    fireEvent.change(screen.getByLabelText(/Crossover Rate/i), {
      target: { value: "0.8" },
    });
    fireEvent.change(screen.getByLabelText(/Dimension/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Number of Generations/i), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("Next"));

    // Page 2 — variant selections.
    fireEvent.click(screen.getByText("Sphere Function"));
    fireEvent.click(screen.getByText("DE/rand/1"));
    fireEvent.click(screen.getByText("Binomial Crossover"));
    fireEvent.click(screen.getByText("STS Selection"));

    // Open + confirm the submission dialog.
    fireEvent.click(screen.getByText("Start Simulation"));
    fireEvent.click(screen.getByText("Confirm & Start"));

    await waitFor(() => {
      expect(simulationService.create).toHaveBeenCalledTimes(1);
    });

    expect(simulationService.create).toHaveBeenCalledWith({
      functions: [5], // Sphere Function -> id 5
      methods: { mutation: [1], crossover: [2], selection: [1] },
      np: 20,
      f: 0.7,
      cr: 0.8,
      gen: 500,
      dim: 10,
    });
  });

  test("uses backend defaults for params the user leaves untouched", async () => {
    simulationService.create.mockResolvedValue({
      data: { simulationId: "abc", queued: true },
    });

    renderSimulator();

    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Sphere Function"));
    fireEvent.click(screen.getByText("DE/rand/1"));
    fireEvent.click(screen.getByText("Exponential Crossover"));
    fireEvent.click(screen.getByText("Greedy Selection"));
    fireEvent.click(screen.getByText("Start Simulation"));
    fireEvent.click(screen.getByText("Confirm & Start"));

    await waitFor(() => {
      expect(simulationService.create).toHaveBeenCalledTimes(1);
    });

    expect(simulationService.create).toHaveBeenCalledWith({
      functions: [5],
      methods: { mutation: [1], crossover: [1], selection: [2] },
      np: 15,
      f: 0.5,
      cr: 0.9,
      gen: 1000,
      dim: 30,
    });
  });

  test("rejects dimension outside the backend range (1-30) on page 1", () => {
    renderSimulator();

    fireEvent.change(screen.getByLabelText(/Dimension/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText("Next"));

    expect(
      screen.getByText("Dimension must be between 1 and 30")
    ).toBeInTheDocument();
    // Still on page 1 (no confirmation dialog).
    expect(screen.queryByText("Confirm & Start")).not.toBeInTheDocument();
  });

  test("rejects population outside the backend range (10-40) on page 1", () => {
    renderSimulator();

    fireEvent.change(screen.getByLabelText(/Number of Population/i), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText("Next"));

    expect(
      screen.getByText("Population must be between 10 and 40")
    ).toBeInTheDocument();
    expect(screen.queryByText("Confirm & Start")).not.toBeInTheDocument();
  });
});
