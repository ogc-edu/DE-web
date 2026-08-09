// Canonical ID <-> name mappings for the DE variant space.
// The backend stores integer IDs (functions 1-10, mutation 1-10, crossover 1-4,
// selection 1-2) while the UI works with display names. The array index + 1 is
// the backend ID. Order mirrors the Simulator/mockData/fitnessData conventions.

export const functionIdToName = [
  "Axis Parallel Hyper Ellipsoid Function",
  "Sum of Different Powers Function",
  "Rotated Hyper Ellipsoid Function",
  "Schwefel 2.22 Function",
  "Sphere Function",
  "Ackley Function",
  "Rastrigin Function",
  "Zakharov Function",
  "Griewangk Function",
  "Quartic with Noise Function",
];

export const functionNameToId = Object.fromEntries(
  functionIdToName.map((name, index) => [name, index + 1])
);

export const mutationIdToName = [
  "DE/rand/1",
  "DE/rand/2",
  "DE/rand/3",
  "DE/best/1",
  "DE/best/2",
  "DE/best/3",
  "DE/current-to-best/1",
  "DE/current-to-best/2",
  "DE/current-to-rand/1",
  "DE/current-to-rand/2",
];

export const mutationNameToId = Object.fromEntries(
  mutationIdToName.map((name, index) => [name, index + 1])
);

export const crossoverIdToName = [
  "exponential",
  "binomial",
  "onepoint",
  "twopoint",
];

export const crossoverNameToId = Object.fromEntries(
  crossoverIdToName.map((name, index) => [name, index + 1])
);

export const selectionIdToName = ["sts", "greedy"];

export const selectionNameToId = Object.fromEntries(
  selectionIdToName.map((name, index) => [name, index + 1])
);

const idListToNames = (ids, names) =>
  (ids || []).map((id) => names[id - 1]).filter(Boolean);

// Normalize a backend Simulation record into the shape the UI tables render.
// Defensive: also passes through already-normalized/mock-shaped records.
export const simulationToDisplay = (sim) => {
  const firstResult = Array.isArray(sim.simulationData)
    ? sim.simulationData[0]
    : null;
  const bestFitness =
    firstResult && firstResult.lowestFitness != null
      ? firstResult.lowestFitness
      : sim.bestFitness ?? null;

  return {
    id: sim._id ?? sim.id,
    status: sim.status,
    timestamp: sim.createdAt ?? sim.timestamp,
    totalModels: sim.totalModels,
    completedModels: sim.completedModels,
    progress: sim.progress,
    model:
      sim.model ??
      (idListToNames(sim.methods?.mutation, mutationIdToName).join(", ") ||
        "N/A"),
    benchmark:
      sim.benchmark ??
      (idListToNames(sim.functions, functionIdToName).join(", ") || "N/A"),
    bestFitness,
    np: sim.np ?? null,
    f: sim.f ?? null,
    cr: sim.cr ?? null,
    generations: sim.generations ?? null,
    dimension: sim.dimension ?? sim.dim ?? null,
  };
};
