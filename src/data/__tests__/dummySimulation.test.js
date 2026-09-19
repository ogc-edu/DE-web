import {
  createDummySimulation,
  DUMMY_SIMULATION_ID,
} from "../dummySimulation";
import {
  mutationIdToName,
  mutationNameToId,
  crossoverIdToName,
  selectionIdToName,
  functionIdToName,
} from "../../data/variantMappings";
import { fitnessDataByCrossoverAndSelection } from "../fitnessData";

describe("dummySimulation", () => {
  const sim = createDummySimulation();

  test("uses the reserved dummy id and is a completed run", () => {
    expect(sim._id).toBe(DUMMY_SIMULATION_ID);
    expect(sim.status).toBe("completed");
    expect(sim.progress).toBe(100);
    expect(sim.completedModels).toBe(sim.totalModels);
  });

  test("mirrors the full reference dataset: 4 crossover × 2 selection × 10 functions × 10 mutations = 800 rows", () => {
    expect(sim.simulationData).toHaveLength(800);
  });

  test("every row carries valid integer ids in backend ranges", () => {
    for (const row of sim.simulationData) {
      expect(functionIdToName[row.functionId - 1]).toBeTruthy();
      expect(mutationIdToName[row.mutationId - 1]).toBeTruthy();
      expect(crossoverIdToName[row.crossoverId - 1]).toBeTruthy();
      expect(selectionIdToName[row.selectionId - 1]).toBeTruthy();
      expect(Number.isFinite(row.lowestFitness)).toBe(true);
      // 0 is a legitimate converged value in the reference dataset (FitnessChart
      // clamps it to 1e-100 for the log scale), but negatives never occur.
      expect(row.lowestFitness).toBeGreaterThanOrEqual(0);
    }
  });

  test("rows match the reference dataset values", () => {
    const reference =
      fitnessDataByCrossoverAndSelection.exponential.sts.sphere.models.find(
        (m) => m.model === "DE/best/2"
      );
    const row = sim.simulationData.find(
      (r) =>
        r.functionId === functionIdToName.indexOf("Sphere Function") + 1 &&
        r.mutationId === mutationNameToId["DE/best/2"] &&
        r.crossoverId === 1 &&
        r.selectionId === 1
    );
    expect(row).toBeTruthy();
    expect(row.lowestFitness).toBe(reference.avgLowestFitness);
  });

  test("declares the full DE variant space in methods/functions", () => {
    expect(sim.functions).toHaveLength(10);
    expect(sim.methods.mutation).toHaveLength(10);
    expect(sim.methods.crossover).toHaveLength(4);
    expect(sim.methods.selection).toHaveLength(2);
  });

  test("carries plausible DE parameters", () => {
    expect(sim.np).toBe(20);
    expect(sim.f).toBe(0.5);
    expect(sim.cr).toBe(0.9);
    expect(sim.gen).toBe(1000);
    expect(sim.dim).toBe(30);
  });

  test("simulationData is deterministic across calls (only createdAt changes)", () => {
    const a = createDummySimulation();
    const b = createDummySimulation();
    expect(a.simulationData).toEqual(b.simulationData);
  });
});
