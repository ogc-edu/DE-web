// Explicit demo dataset behind the Dashboard's "Use dummy data" button.
//
// Frontend-only by design: the backend has no demo-data endpoint, and dummy
// rows must never reach the real MongoDB `simulations` collection (the EC2
// worker writes to the same collection). This module derives a realistic
// *completed* simulation record from the built-in reference dataset in
// fitnessData.js so users can try the table, detail grid, stats and CSV
// export without running a real simulation or even having the backend up.
//
// Shape note: this mirrors a backend Simulation record (the input shape of
// `simulationToDisplay`), not the display shape — the context normalizes it.

import {
  fitnessDataByCrossoverAndSelection,
} from "./fitnessData";
import {
  functionIdToName,
  mutationNameToId,
  crossoverNameToId,
  selectionNameToId,
} from "./variantMappings";

export const DUMMY_SIMULATION_ID = "dummy-demo-run";

// Fixed, plausible DE parameters for the demo run.
const DUMMY_PARAMS = { np: 20, f: 0.5, cr: 0.9, gen: 1000, dim: 30 };

// Build one (function × model) row per entry of the reference dataset:
// 4 crossovers × 2 selections × 10 functions × 10 mutations = 800 rows.
// Note: fitnessData.js names 3 schemes without the "DE/" prefix ("rand/1",
// "rand/2", "rand/3") — normalize them so every row maps to a mutation id.
const normalizeModelName = (name) =>
  name.startsWith("DE/") ? name : `DE/${name}`;

const buildSimulationData = () => {
  const rows = [];
  const functionIds = new Set();

  Object.entries(fitnessDataByCrossoverAndSelection).forEach(
    ([crossoverName, bySelection]) => {
      const crossoverId = crossoverNameToId[crossoverName];
      Object.entries(bySelection).forEach(([selectionName, byFunction]) => {
        const selectionId = selectionNameToId[selectionName];
        if (!crossoverId || !selectionId) return;
        Object.values(byFunction).forEach((fnData) => {
          const functionId = functionIdToName.indexOf(fnData.name) + 1;
          if (functionId < 1) return;
          functionIds.add(functionId);
          (fnData.models || []).forEach((model) => {
            const mutationId = mutationNameToId[normalizeModelName(model.model)];
            if (!mutationId || model.avgLowestFitness == null) return;
            rows.push({
              functionId,
              mutationId,
              crossoverId,
              selectionId,
              lowestFitness: model.avgLowestFitness,
            });
          });
        });
      });
    }
  );

  return { rows, functionIds: [...functionIds].sort((a, b) => a - b) };
};

// Returns a fresh backend-shaped completed simulation. Deterministic rows;
// only `createdAt` reflects "now".
export const createDummySimulation = () => {
  const { rows, functionIds } = buildSimulationData();
  return {
    _id: DUMMY_SIMULATION_ID,
    status: "completed",
    createdAt: new Date().toISOString(),
    totalModels: rows.length,
    completedModels: rows.length,
    progress: 100,
    np: DUMMY_PARAMS.np,
    f: DUMMY_PARAMS.f,
    cr: DUMMY_PARAMS.cr,
    gen: DUMMY_PARAMS.gen,
    dim: DUMMY_PARAMS.dim,
    functions: functionIds,
    methods: {
      mutation: Object.values(mutationNameToId),
      crossover: Object.values(crossoverNameToId),
      selection: Object.values(selectionNameToId),
    },
    simulationData: rows,
  };
};
