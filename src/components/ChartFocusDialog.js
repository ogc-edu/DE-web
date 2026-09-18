import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import FitnessChart from "./FitnessChart";
import {
  buildGrouped,
  buildTopN,
  functionMeta,
  selectionColor,
  selectionShortLabel,
  FITNESS_FLOOR,
} from "../data/chartSelection";
import { formatFitness, selectionIdToName } from "../data/variantMappings";

// A 45-decade log axis in a 350px plot area puts two models 0.083 decades apart
// 0.6px from each other. Enlarging the chart does not fix that; rescaling the
// axis does. This view exists for the rescale — plus the two cheaper fixes:
// putting compared bars next to each other (Ranked) and printing the numbers.

const DEFAULT_CONTROLS = { view: "grouped", type: "bar", scale: "auto" };

const VIEWS = [
  { key: "grouped", label: "Grouped" },
  { key: "ranked", label: "Ranked" },
];
const TYPES = [
  { key: "bar", label: "Bar" },
  { key: "line", label: "Line" },
];
const SCALES = [
  { key: "auto", label: "Auto" },
  { key: "log", label: "Log" },
  { key: "linear", label: "Linear" },
];

// buildTopN labels read "<mutation> · <crossover> · <selection short label>";
// the short label is the only part that identifies the selection method, and
// recovering it here keeps the builders untouched.
const selectionFromLabel = (label) =>
  selectionIdToName.find((key) =>
    String(label).endsWith(`· ${selectionShortLabel(key)}`)
  ) || null;

// "1.00×", "3.42×", "1.2e12×" — a ratio can easily span forty decades, which no
// fixed-point rendering survives.
const formatRatio = (ratio) => {
  if (!Number.isFinite(ratio)) return "—";
  if (ratio < 1000) return `${ratio.toFixed(2)}×`;
  return `${ratio.toExponential(1).replace("e+", "e")}×`;
};

const ToggleGroup = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <div className="flex rounded-lg border border-gray-200 p-0.5">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === option.key
              ? "bg-accent-600 text-white"
              : "text-muted-foreground hover:text-primary-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

/**
 * One benchmark function, large, with a rescalable value axis and the exact
 * numbers underneath.
 *
 * @param functionKeys  every function in the grid, for prev/next
 * @param activeKey     the function on screen
 * @param onNavigate    called with the next function key
 * @param selection     the Dashboard's canonical selection state
 */
const ChartFocusDialog = ({
  open,
  onOpenChange,
  functionKeys = [],
  activeKey,
  onNavigate,
  selection,
}) => {
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const chartRef = useRef(null);

  // react-chartjs-2 is mocked in tests and the stub carries no Chart instance,
  // so every call through this ref is optional all the way down.
  const resetZoom = () => chartRef.current?.resetZoom?.();

  useEffect(() => {
    if (open) setControls(DEFAULT_CONTROLS);
  }, [open]);

  // A new function means a new axis range; the old zoom window would be
  // meaningless. The view/type/scale controls deliberately survive.
  useEffect(() => {
    chartRef.current?.resetZoom?.();
  }, [activeKey]);

  const meta = useMemo(
    () => (activeKey ? functionMeta(activeKey) : null),
    [activeKey]
  );

  // The Ranked chart and the table are the same query, asked once.
  const ranked = useMemo(
    () => (activeKey ? buildTopN(activeKey, selection, null) : null),
    [activeKey, selection]
  );
  const grouped = useMemo(
    () => (activeKey ? buildGrouped(activeKey, selection) : null),
    [activeKey, selection]
  );

  const rows = useMemo(() => {
    if (!ranked) return [];
    const values = ranked.datasets[0]?.data || [];
    const flags = ranked.belowFloor[0] || [];
    const best = values[0];
    // Every row would be a ratio against a converged value — meaningless, and
    // Infinity on the screen. The column stands down instead.
    const ratiosMeaningful =
      Number.isFinite(best) && best > FITNESS_FLOOR;

    return ranked.labels.map((label, index) => ({
      label,
      value: values[index],
      below: flags[index],
      selection: selectionFromLabel(label),
      ratio: ratiosMeaningful ? formatRatio(values[index] / best) : "—",
    }));
  }, [ranked]);

  if (!open || !activeKey || !meta) {
    return (
      <Dialog open={open && Boolean(activeKey)} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogTitle>No data</DialogTitle>
          <p className="text-sm text-muted-foreground">
            No experimental data available for this configuration
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const index = functionKeys.indexOf(activeKey);
  const step = (delta) => {
    if (functionKeys.length === 0) return;
    const next =
      (index + delta + functionKeys.length) % functionKeys.length;
    onNavigate?.(functionKeys[next]);
  };

  const chart = controls.view === "ranked" ? ranked : grouped;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-6xl w-[95vw] max-h-[92vh] flex-col rounded-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 pr-14">
          <div className="min-w-0">
            <DialogTitle className="text-xl font-bold text-primary-900">
              {meta.name}
            </DialogTitle>
            <div className="mt-2 inline-block rounded-lg border border-gray-50 bg-neutral-50 p-2 text-xs text-muted-foreground">
              <InlineMath math={meta.description.replace(/\$/g, "")} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              aria-label="Previous function"
              onClick={() => step(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-1 text-xs text-muted-foreground">
              {index + 1} / {functionKeys.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              aria-label="Next function"
              onClick={() => step(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogClose onClick={() => onOpenChange(false)} className="top-5" />

        {/* Fixed height and no scroller: a wheel over a scrolling chart fights
            the zoom plugin instead of driving it. */}
        <div className="h-[55vh] shrink-0 px-5 pt-4">
          <FitnessChart
            functionData={meta}
            labels={chart.labels}
            datasets={chart.datasets}
            belowFloor={chart.belowFloor}
            horizontal={chart.horizontal}
            chartType={controls.type}
            scale={controls.scale}
            chartRef={chartRef}
            zoomable
            hideHeader
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-5 py-3">
          <ToggleGroup
            label="View"
            options={VIEWS}
            value={controls.view}
            onChange={(view) => setControls((prev) => ({ ...prev, view }))}
          />
          <ToggleGroup
            label="Type"
            options={TYPES}
            value={controls.type}
            onChange={(type) => setControls((prev) => ({ ...prev, type }))}
          />
          <ToggleGroup
            label="Scale"
            options={SCALES}
            value={controls.scale}
            onChange={(scale) => setControls((prev) => ({ ...prev, scale }))}
          />
          <Button variant="outline" size="sm" onClick={resetZoom}>
            Reset zoom
          </Button>
          <span className="text-xs text-muted-foreground">
            Drag across the value axis to zoom · shift-drag to pan
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Avg. lowest fitness</TableHead>
                <TableHead>×best</TableHead>
                <TableHead>Selection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rank) => (
                <TableRow key={row.label}>
                  <TableCell className="text-muted-foreground">
                    {rank + 1}
                  </TableCell>
                  <TableCell className="font-medium text-primary-900">
                    {row.label}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.below ? "< 1e-100" : formatFitness(row.value)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.ratio}</TableCell>
                  <TableCell
                    className="font-medium"
                    style={{ color: selectionColor(row.selection) }}
                  >
                    {row.selection ? selectionShortLabel(row.selection) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartFocusDialog;
