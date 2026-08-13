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

// True best fitness = minimum lowestFitness across all result rows (DE minimizes).
const computeBestFitness = (sim) => {
  if (Array.isArray(sim.simulationData) && sim.simulationData.length > 0) {
    const values = sim.simulationData
      .map((row) => row?.lowestFitness)
      .filter((v) => v != null && Number.isFinite(Number(v)))
      .map(Number);
    if (values.length > 0) return Math.min(...values);
  }
  return sim.bestFitness ?? null;
};

// Human-readable model summary: mutations (+ counts for other operators when useful).
const formatModelSummary = (sim) => {
  if (sim.model) return sim.model;
  const mutations = idListToNames(sim.methods?.mutation, mutationIdToName);
  if (mutations.length === 0) return "N/A";
  const nCross = (sim.methods?.crossover || []).length;
  const nSel = (sim.methods?.selection || []).length;
  const base = mutations.join(", ");
  if (nCross <= 1 && nSel <= 1) return base;
  const bits = [];
  if (nCross > 1) bits.push(`${nCross} crossovers`);
  if (nSel > 1) bits.push(`${nSel} selections`);
  return bits.length ? `${base} · ${bits.join(" · ")}` : base;
};

// Normalize a backend Simulation record into the shape the UI tables render.
// Defensive: also passes through already-normalized/mock-shaped records.
export const simulationToDisplay = (sim) => {
  const mutationNames = idListToNames(sim.methods?.mutation, mutationIdToName);
  const crossoverNames = idListToNames(sim.methods?.crossover, crossoverIdToName);
  const selectionNames = idListToNames(sim.methods?.selection, selectionIdToName);
  const functionNames = idListToNames(sim.functions, functionIdToName);

  return {
    id: sim._id ?? sim.id,
    status: sim.status,
    timestamp: sim.createdAt ?? sim.timestamp,
    totalModels: sim.totalModels,
    completedModels: sim.completedModels,
    progress: sim.progress,
    // Keep `model` for search/back-compat; prefer mutations for display.
    model: sim.model ?? (mutationNames.join(", ") || "N/A"),
    mutations: mutationNames,
    crossovers: crossoverNames,
    selections: selectionNames,
    modelSummary: formatModelSummary(sim),
    benchmark:
      sim.benchmark ?? (functionNames.join(", ") || "N/A"),
    functionNames,
    functionIds: sim.functions || [],
    bestFitness: computeBestFitness(sim),
    np: sim.np ?? null,
    f: sim.f ?? null,
    cr: sim.cr ?? null,
    generations: sim.generations ?? sim.gen ?? null,
    dimension: sim.dimension ?? sim.dim ?? null,
    // Full rows when present (detail page / export).
    simulationData: Array.isArray(sim.simulationData) ? sim.simulationData : [],
    methods: sim.methods || null,
    functions: sim.functions || null,
  };
};

export const formatFitness = (value) => {
  if (value == null || !Number.isFinite(Number(value))) return "N/A";
  return Number(value).toExponential(4);
};

export const modelNameFromIds = (mutationId, crossoverId, selectionId) => {
  const m = mutationIdToName[mutationId - 1] || `M${mutationId}`;
  const c = crossoverIdToName[crossoverId - 1] || `C${crossoverId}`;
  const s = selectionIdToName[selectionId - 1] || `S${selectionId}`;
  return `${m}/${c}/${s}`;
};
