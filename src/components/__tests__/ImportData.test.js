import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ImportData from "../ImportData";
import { simulationService } from "../../services/api";

jest.mock("../../services/api", () => ({
  simulationService: {
    importFile: jest.fn(),
  },
}));

const mockSimulation = {
  fetchSimulations: jest.fn(),
};
jest.mock("../../context/SimulationContext", () => ({
  useSimulation: () => mockSimulation,
}));

const mockAuth = {
  user: { role: "user", name: "User", email: "user@test.com" },
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

// jsdom's FileReader cannot read Node's File objects, so mock it to resolve
// with the plain object's `content` (the component only uses name/size/content).
class MockFileReader {
  readAsText(file) {
    this.result = file.content;
    if (this.onload) {
      this.onload({ target: { result: this.result } });
    }
  }
}

const renderPage = () => render(<ImportData />);

const makeFile = (name, content) => ({
  name,
  size: content.length,
  content,
});

beforeEach(() => {
  jest.clearAllMocks();
  global.FileReader = MockFileReader;
  simulationService.importFile.mockReset();
  mockSimulation.fetchSimulations.mockReset();
  mockSimulation.fetchSimulations.mockResolvedValue(undefined);
});

describe("ImportData", () => {
  test("renders the format guide, valid names, and a download template button", () => {
    renderPage();

    expect(screen.getByText("How to format your file")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download template/i })).toBeInTheDocument();
    // Valid-name lists from variantMappings.
    expect(screen.getByText("DE/best/1/binomial/greedy")).toBeInTheDocument();
    expect(screen.getByText(/exponential, binomial, onepoint, twopoint/i)).toBeInTheDocument();
    expect(screen.getByText(/sts, greedy/i)).toBeInTheDocument();
  });

  test("rejects a non-.txt file with a helpful message", () => {
    renderPage();
    const input = screen.getByLabelText(/\.txt file/i);

    fireEvent.change(input, { target: { files: [makeFile("data.csv", "content")] } });

    expect(screen.getByText("Please choose a .txt file.")).toBeInTheDocument();
    expect(simulationService.importFile).not.toHaveBeenCalled();
  });

  test("imports a valid .txt file and refreshes the simulation list", async () => {
    simulationService.importFile.mockResolvedValue({
      data: { simulationId: "abc123", totalModels: 2 },
    });

    renderPage();
    const input = screen.getByLabelText(/\.txt file/i);

    const content = [
      "model\tbenchmark\tlowestFitness",
      "DE/best/1/binomial/greedy\t1\t0.5",
      "DE/rand/3/exponential/sts\t6\t1.09e-14",
    ].join("\n");

    await act(async () => {
      fireEvent.change(input, { target: { files: [makeFile("data.txt", content)] } });
      await screen.findByText("data.txt");
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /import data/i }));
    });

    expect(simulationService.importFile).toHaveBeenCalledWith({
      content,
      filename: "data.txt",
    });
    expect(mockSimulation.fetchSimulations).toHaveBeenCalled();
    expect(
      await screen.findByText(/Imported 2 results successfully!/i)
    ).toBeInTheDocument();
  });

  test("renders line-numbered errors returned by the backend", async () => {
    simulationService.importFile.mockRejectedValue({
      response: {
        data: {
          message: "Import failed",
          errors: [{ line: 2, message: "unknown crossover 'bin'." }],
        },
      },
    });

    renderPage();
    const input = screen.getByLabelText(/\.txt file/i);
    const content = "model\tbenchmark\tlowestFitness\nDE/best/1/bin/greedy\t1\t0.5";

    await act(async () => {
      fireEvent.change(input, { target: { files: [makeFile("data.txt", content)] } });
      await screen.findByText("data.txt");
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /import data/i }));
    });

    expect(await screen.findByText(/Import failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Line 2: unknown crossover 'bin'/i)).toBeInTheDocument();
  });
});
