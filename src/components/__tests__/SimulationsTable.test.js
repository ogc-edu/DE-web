import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import SimulationsTable from "../SimulationsTable";
import { simulationService } from "../../services/api";

jest.mock("../../services/api", () => ({
  simulationService: {
    getResults: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const sim = (over = {}) => ({
  id: "sim-1",
  status: "completed",
  timestamp: "2026-01-02T03:04:05.000Z",
  modelSummary: "DE/rand/1",
  model: "DE/rand/1",
  benchmark: "Sphere Function",
  functionNames: ["Sphere Function"],
  bestFitness: 1.5e-8,
  np: 20,
  f: 0.5,
  cr: 0.9,
  totalModels: 8,
  completedModels: 8,
  progress: 100,
  simulationData: [],
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SimulationsTable", () => {
  test("renders a row per simulation with its formatted fitness", () => {
    render(<SimulationsTable simulations={[sim()]} />);

    expect(screen.getByText("DE/rand/1")).toBeInTheDocument();
    expect(screen.getByText("Sphere Function")).toBeInTheDocument();
    // formatFitness renders exponential notation.
    expect(screen.getByText("1.5000e-8")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("reports the filtered and total counts", () => {
    render(
      <SimulationsTable
        simulations={[sim(), sim({ id: "sim-2", modelSummary: "DE/best/1" })]}
      />
    );

    expect(screen.getByText("2 of 2 simulations")).toBeInTheDocument();
  });

  test("search narrows the rows", () => {
    render(
      <SimulationsTable
        simulations={[sim(), sim({ id: "sim-2", modelSummary: "DE/best/2" })]}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search simulations..."), {
      target: { value: "best" },
    });

    expect(screen.getByText("1 of 2 simulations")).toBeInTheDocument();
    expect(screen.getByText("DE/best/2")).toBeInTheDocument();
    expect(screen.queryByText("DE/rand/1")).not.toBeInTheDocument();
  });

  test("a search with no matches explains itself rather than looking empty", () => {
    render(<SimulationsTable simulations={[sim()]} />);

    fireEvent.change(screen.getByPlaceholderText("Search simulations..."), {
      target: { value: "zzzz" },
    });

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search or filters.")
    ).toBeInTheDocument();
  });

  test("the first-run empty state offers a way to start", () => {
    render(<SimulationsTable simulations={[]} />);

    expect(screen.getByText("No simulations yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /run simulation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /import data/i })
    ).toBeInTheDocument();
  });

  test("shows a loading state instead of an empty table", () => {
    render(<SimulationsTable simulations={[]} loading />);

    expect(screen.getByText("Loading simulations...")).toBeInTheDocument();
    expect(screen.queryByText("No simulations yet")).not.toBeInTheDocument();
  });

  test("surfaces a load error", () => {
    render(<SimulationsTable simulations={[]} error="Network is down" />);

    expect(screen.getByText("Failed to load simulations")).toBeInTheDocument();
    expect(screen.getByText("Network is down")).toBeInTheDocument();
  });

  test("clicking a row opens the detail page", () => {
    render(<SimulationsTable simulations={[sim()]} />);

    fireEvent.click(screen.getByText("DE/rand/1"));

    expect(mockNavigate).toHaveBeenCalledWith("/api/simulations/sim-1");
  });

  test("deleting asks for confirmation before calling onDelete", async () => {
    const onDelete = jest.fn().mockResolvedValue(true);
    render(<SimulationsTable simulations={[sim()]} onDelete={onDelete} />);

    fireEvent.click(screen.getByTitle("Delete"));

    // src/components/ui/dialog.jsx is hand-rolled and sets no role="dialog",
    // so scope to the confirm panel via its heading rather than by role.
    const heading = screen.getByText("Delete simulation?");
    const dialog = heading.closest("div.relative");
    expect(dialog).not.toBeNull();
    expect(onDelete).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    });

    expect(onDelete).toHaveBeenCalledWith("sim-1");
  });

  test("lazily fetches result rows before exporting CSV when the list record has none", async () => {
    simulationService.getResults.mockResolvedValue({
      data: {
        simulationId: "sim-1",
        simulationData: [
          {
            functionId: 1,
            mutationId: 1,
            crossoverId: 1,
            selectionId: 1,
            lowestFitness: 1e-9,
          },
        ],
      },
    });

    let blobParts = null;
    const blobSpy = jest
      .spyOn(global, "Blob")
      .mockImplementation((parts, options) => {
        blobParts = parts;
        return { type: options?.type };
      });
    const createObjectURL = jest.fn(() => "blob:csv");
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(<SimulationsTable simulations={[sim({ simulationData: [] })]} />);
    const button = screen.getByTitle("Download CSV");
    // No rows in the list payload, but the button stays usable.
    expect(button).not.toBeDisabled();
    expect(simulationService.getResults).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(simulationService.getResults).toHaveBeenCalledWith("sim-1");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(blobParts.join("\n")).toContain(
      "functionId,mutationId,crossoverId,selectionId,lowestFitness"
    );
    expect(blobParts.join("\n")).toContain("1,1,1,1,1e-9");
    expect(clickSpy).toHaveBeenCalledTimes(1);

    blobSpy.mockRestore();
    clickSpy.mockRestore();
  });

  test("exports existing rows without hitting the results endpoint", async () => {
    const blobSpy = jest
      .spyOn(global, "Blob")
      .mockImplementation(() => ({}));
    global.URL.createObjectURL = jest.fn(() => "blob:csv");
    global.URL.revokeObjectURL = jest.fn();
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(
      <SimulationsTable
        simulations={[
          sim({
            simulationData: [
              {
                functionId: 2,
                mutationId: 1,
                crossoverId: 1,
                selectionId: 1,
                lowestFitness: 3e-7,
              },
            ],
          }),
        ]}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTitle("Download CSV"));
    });

    expect(simulationService.getResults).not.toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    blobSpy.mockRestore();
    clickSpy.mockRestore();
  });

  test("a failed lazy CSV fetch surfaces an error and keeps the button usable", async () => {
    simulationService.getResults.mockRejectedValue({
      response: { data: { error: "Results unavailable" } },
    });

    render(<SimulationsTable simulations={[sim({ simulationData: [] })]} />);
    const button = screen.getByTitle("Download CSV");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText("Failed to download CSV")).toBeInTheDocument();
    expect(screen.getByText("Results unavailable")).toBeInTheDocument();
    // Retry remains possible.
    expect(button).not.toBeDisabled();
  });

  test("in-flight simulations show their progress", () => {
    render(
      <SimulationsTable
        simulations={[
          sim({ status: "running", progress: 42, completedModels: 3 }),
        ]}
      />
    );

    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("42% · 3/8 models")).toBeInTheDocument();
  });

  test("the status filter only appears when asked for", () => {
    const { rerender } = render(<SimulationsTable simulations={[sim()]} />);
    expect(screen.queryByText("All Statuses")).not.toBeInTheDocument();

    rerender(<SimulationsTable simulations={[sim()]} showStatusFilter />);
    expect(screen.getByText("All Statuses")).toBeInTheDocument();
  });
});
