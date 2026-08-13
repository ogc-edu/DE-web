import {
  simulationToDisplay,
  formatFitness,
  modelNameFromIds,
} from "../variantMappings";

describe("variantMappings helpers", () => {
  test("simulationToDisplay uses min lowestFitness across rows", () => {
    const display = simulationToDisplay({
      _id: "abc",
      status: "completed",
      functions: [1, 6],
      methods: { mutation: [4, 3], crossover: [2, 1], selection: [2, 1] },
      simulationData: [
        { functionId: 1, mutationId: 4, crossoverId: 2, selectionId: 2, lowestFitness: 2.5 },
        { functionId: 6, mutationId: 3, crossoverId: 1, selectionId: 1, lowestFitness: 0.01 },
      ],
      np: 15,
      f: 0.5,
      cr: 0.9,
      gen: 1000,
      dim: 30,
      totalModels: 2,
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(display.bestFitness).toBe(0.01);
    expect(display.modelSummary).toContain("DE/best/1");
    expect(display.functionNames).toEqual([
      "Axis Parallel Hyper Ellipsoid Function",
      "Ackley Function",
    ]);
    expect(display.simulationData).toHaveLength(2);
  });

  test("formatFitness handles null and numbers", () => {
    expect(formatFitness(null)).toBe("N/A");
    expect(formatFitness(1.23e-4)).toMatch(/e/i);
  });

  test("modelNameFromIds builds canonical model string", () => {
    expect(modelNameFromIds(4, 2, 2)).toBe("DE/best/1/binomial/greedy");
  });
});
