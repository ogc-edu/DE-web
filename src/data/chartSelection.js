// Pure selection + aggregation logic for the Dashboard's reference charts.
//
// Deliberately free of React, fetch and context imports: `fitnessData.js` is the
// only source today, and swapping it for real simulation results must stay a
// one-file change.
//
// Selection state shape (the canonical object every export below consumes):
//   {
//     mode: "quick" | "custom",
//     crossovers: string[],   // keys from variantMappings.crossoverIdToName
//     selections: string[],   // keys from variantMappings.selectionIdToName
//     mutations: string[],    // canonical names from variantMappings.mutationIdToName
//     topN: number | null,
//   }

import { getFunctionDataByCrossoverAndSelection } from "./fitnessData";
import {
  mutationIdToName,
  crossoverIdToName,
  selectionIdToName,
} from "./variantMappings";

// Values at or below this cannot be plotted on a log scale, so they are clamped.
// Every clamped point is reported through `belowFloor` so the chart can say
// "converged" instead of presenting the clamp as a measurement.
export const FITNESS_FLOOR = 1e-100;

// Comfortable reading limit. Above this the chart still renders — the UI warns
// and offers Top-N rather than blocking the selection.
export const COMFORTABLE_SERIES = 4;

// Categorical palette (dataviz skill reference instance, light mode). Validated:
// worst adjacent CVD ΔE 9.1, worst adjacent normal-vision ΔE 19.6, all eight
// inside the lightness band. Slots are assigned in fixed order and never cycled —
// eight slots for the eight (crossover × selection) pairs, exactly.
export const CATEGORICAL_PALETTE = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

const SELECTION_SHORT_LABEL = { sts: "STS", greedy: "Greedy" };

const CROSSOVER_SHORT_LABEL = {
  exponential: "exponential",
  binomial: "binomial",
  onepoint: "one-point",
  twopoint: "two-point",
};

// `fitnessData.js` names three mutations `rand/1..3` while variantMappings calls
// them `DE/rand/1..3`. Normalise on read, in this one place, so selection state
// can key off the canonical names. The data file itself is left untouched.
export const normalizeMutationName = (name) => {
  if (typeof name !== "string") return name;
  return name.startsWith("DE/") ? name : `DE/${name}`;
};

export const selectionShortLabel = (selectionKey) =>
  SELECTION_SHORT_LABEL[selectionKey] || selectionKey;

export const seriesLabel = (crossoverKey, selectionKey) =>
  `${CROSSOVER_SHORT_LABEL[crossoverKey] || crossoverKey} · ${selectionShortLabel(
    selectionKey
  )}`;

// Deterministic from the pair alone, so a series keeps its colour across all ten
// charts on screen and across any filter change (colour follows the entity, never
// its rank).
export const seriesColor = (crossoverKey, selectionKey) => {
  const c = crossoverIdToName.indexOf(crossoverKey);
  const s = selectionIdToName.indexOf(selectionKey);
  if (c < 0 || s < 0) return CATEGORICAL_PALETTE[0];
  return CATEGORICAL_PALETTE[
    (c * selectionIdToName.length + s) % CATEGORICAL_PALETTE.length
  ];
};

// Top-N bars are coloured by selection method so the STS/Greedy split stays
// visible once the crossover identity has moved into the bar label.
export const selectionColor = (selectionKey) => {
  const s = selectionIdToName.indexOf(selectionKey);
  return CATEGORICAL_PALETTE[s < 0 ? 0 : s];
};

export const seriesCount = (sel) =>
  (sel?.crossovers?.length || 0) * (sel?.selections?.length || 0);

export const barCount = (sel) =>
  seriesCount(sel) * (sel?.mutations?.length || 0);

// Keep the caller's picks but always emit them in canonical order, so datasets,
// labels and colours line up no matter how the checkboxes were clicked.
const inCanonicalOrder = (picked, canonical) =>
  canonical.filter((key) => (picked || []).includes(key));

// { [canonical mutation name]: avgLowestFitness } for one (crossover, selection).
const modelsByMutation = (crossoverKey, selectionKey, fnKey) => {
  const data = getFunctionDataByCrossoverAndSelection(
    crossoverKey,
    selectionKey,
    fnKey
  );
  const byMutation = {};
  (data?.models || []).forEach((model) => {
    byMutation[normalizeMutationName(model.model)] = model.avgLowestFitness;
  });
  return byMutation;
};

// -> { value, below } — `value` is null when the model is absent from the data.
const clamp = (raw) => {
  if (raw == null || !Number.isFinite(raw)) return { value: null, below: false };
  if (raw === 0 || raw < FITNESS_FLOOR) return { value: FITNESS_FLOOR, below: true };
  return { value: raw, below: false };
};

export const functionMeta = (fnKey) => {
  const data =
    getFunctionDataByCrossoverAndSelection("exponential", "sts", fnKey) || null;
  return data ? { name: data.name, description: data.description } : null;
};

/**
 * x-axis = selected mutations, one dataset per (crossover, selection) pair.
 * A model missing from the reference data yields `null` so Chart.js draws a gap
 * rather than a zero.
 */
export const buildGrouped = (fnKey, sel) => {
  const labels = inCanonicalOrder(sel?.mutations, mutationIdToName);
  const crossovers = inCanonicalOrder(sel?.crossovers, crossoverIdToName);
  const selections = inCanonicalOrder(sel?.selections, selectionIdToName);

  const datasets = [];
  const belowFloor = [];

  crossovers.forEach((crossoverKey) => {
    selections.forEach((selectionKey) => {
      const byMutation = modelsByMutation(crossoverKey, selectionKey, fnKey);
      const data = [];
      const flags = [];
      labels.forEach((mutationName) => {
        const { value, below } = clamp(byMutation[mutationName]);
        data.push(value);
        flags.push(below);
      });
      const color = seriesColor(crossoverKey, selectionKey);
      datasets.push({
        label: seriesLabel(crossoverKey, selectionKey),
        crossover: crossoverKey,
        selection: selectionKey,
        data,
        backgroundColor: color,
        borderColor: color,
      });
      belowFloor.push(flags);
    });
  });

  // Mutation names are short enough to sit under a vertical bar; the rotation
  // rule falls back to the category count.
  return { labels, datasets, belowFloor, horizontal: labels.length > 10 };
};

/**
 * Flatten every selected (mutation × crossover × selection) row for one function,
 * sort ascending (DE minimises), keep the best `n`, and return a single dataset
 * whose labels are full model names.
 */
export const buildTopN = (fnKey, sel, n) => {
  const mutations = inCanonicalOrder(sel?.mutations, mutationIdToName);
  const crossovers = inCanonicalOrder(sel?.crossovers, crossoverIdToName);
  const selections = inCanonicalOrder(sel?.selections, selectionIdToName);

  const rows = [];
  crossovers.forEach((crossoverKey) => {
    selections.forEach((selectionKey) => {
      const byMutation = modelsByMutation(crossoverKey, selectionKey, fnKey);
      mutations.forEach((mutationName) => {
        const raw = byMutation[mutationName];
        const { value, below } = clamp(raw);
        if (value === null) return;
        rows.push({
          label: `${mutationName} · ${CROSSOVER_SHORT_LABEL[crossoverKey] ||
            crossoverKey} · ${selectionShortLabel(selectionKey)}`,
          value,
          below,
          selection: selectionKey,
        });
      });
    });
  });

  rows.sort((a, b) => a.value - b.value);
  const kept = n == null ? rows : rows.slice(0, Math.max(0, n));

  return {
    // Top-N labels are full "mutation · crossover · selection" names — far too
    // long for a rotated x-axis tick even when there are only ten of them, so
    // this mode always draws horizontally.
    horizontal: true,
    labels: kept.map((row) => row.label),
    datasets: [
      {
        label: "Avg. lowest fitness",
        data: kept.map((row) => row.value),
        backgroundColor: kept.map((row) => selectionColor(row.selection)),
        borderColor: kept.map((row) => selectionColor(row.selection)),
      },
    ],
    belowFloor: [kept.map((row) => row.below)],
  };
};

// The one entry point the Dashboard needs: Top-N when asked for, grouped otherwise.
export const buildChartData = (fnKey, sel) =>
  sel?.topN == null ? buildGrouped(fnKey, sel) : buildTopN(fnKey, sel, sel.topN);
