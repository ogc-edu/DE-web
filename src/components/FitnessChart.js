import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Bar, Line } from "react-chartjs-2";
import { InlineMath } from "react-katex";
import { Maximize2 } from "lucide-react";
import "katex/dist/katex.min.css";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FITNESS_FLOOR } from "../data/chartSelection";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// Beyond this many categories, 9px labels rotated 45° stop being readable; the
// chart flips to horizontal bars and scrolls instead. The caller can force the
// rotation regardless of count when its labels are long (Top-N model names).
const HORIZONTAL_THRESHOLD = 10;
const ROW_HEIGHT = 28;

// Bars carry a colour per point; a line is one path. Chart.js resolves
// line-element options without index resolution, so a colour ARRAY reaches
// `strokeStyle` unusable and the line silently falls back to black. Line mode
// therefore collapses the path to a single colour and keeps the per-point array
// on the points. The palette is opaque, so the area fill needs its own alpha.
const FILL_ALPHA = 0.25;

const withAlpha = (color, alpha) => {
  if (typeof color !== "string" || !/^#[0-9a-f]{6}$/i.test(color.trim())) {
    return color;
  }
  const hex = color.trim();
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const first = (value) => (Array.isArray(value) ? value[0] : value);

/**
 * Renders one benchmark function. All selection/aggregation lives in
 * `src/data/chartSelection.js` — this component only draws what it is handed.
 *
 * @param functionData  { name, description } for the card header
 * @param labels        category labels
 * @param datasets      one entry per series, already coloured
 * @param belowFloor    boolean[datasetIndex][pointIndex]; true where the value
 *                      was clamped to FITNESS_FLOOR for log plotting
 * @param horizontal    force the bar orientation; defaults to the category count
 * @param zoomable      opt in to wheel/drag zoom and shift-pan on the value axis
 * @param scale         "auto" (max/min > 1000 -> log) | "log" | "linear"
 * @param chartRef      forwarded to the Chart instance, for resetZoom()
 * @param onExpand      when given, renders a focus button in the card header
 * @param hideHeader    drop the card header when the caller already shows the
 *                      function name and formula (the focused dialog does)
 */
const FitnessChart = ({
  functionData,
  labels = [],
  datasets = [],
  belowFloor = [],
  horizontal: forceHorizontal,
  chartType = "bar",
  zoomable = false,
  scale = "auto",
  chartRef,
  onExpand,
  hideHeader = false,
}) => {
  if (!functionData || datasets.length === 0 || labels.length === 0) {
    return (
      <Card className="border-none shadow-sm h-full flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          No experimental data available for this configuration
        </p>
      </Card>
    );
  }

  const horizontal = forceHorizontal ?? labels.length > HORIZONTAL_THRESHOLD;
  const valueAxis = horizontal ? "x" : "y";
  const categoryAxis = horizontal ? "y" : "x";

  const plottedValues = datasets
    .flatMap((dataset) => dataset.data)
    .filter((value) => value !== null && value > FITNESS_FLOOR);
  const maxValue = Math.max(...plottedValues);
  const minValue = Math.min(...plottedValues);
  const autoLogScale = plottedValues.length > 0 && maxValue / minValue > 1000;
  // An explicit scale is the whole point of the focused view: the auto rule is
  // right for a thumbnail grid and wrong the moment you want to read two
  // near-identical bars apart.
  const useLogScale =
    scale === "log" ? true : scale === "linear" ? false : autoLogScale;

  const valueScale = {
    type: useLogScale ? "logarithmic" : "linear",
    grid: { color: "#f1f5f9" },
    ticks: {
      font: { size: 10 },
      callback: (value) => (value === FITNESS_FLOOR ? "0" : value.toExponential(0)),
    },
  };
  const categoryScale = {
    grid: { display: false },
    ticks: horizontal
      ? { font: { size: 10 }, autoSkip: false }
      : { font: { size: 9 }, maxRotation: 45, minRotation: 45 },
  };

  const options = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            family: "Inter, system-ui, sans-serif",
            size: 11,
            weight: "500",
          },
        },
      },
      title: { display: false },
      // The plugin is registered globally, so every chart must state its
      // position — an omitted block would leave the grid thumbnails zoomable.
      zoom: zoomable
        ? {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: false },
              drag: { enabled: true },
              mode: valueAxis,
            },
            pan: { enabled: true, mode: valueAxis, modifierKey: "shift" },
          }
        : {
            zoom: {
              wheel: { enabled: false },
              pinch: { enabled: false },
              drag: { enabled: false },
            },
            pan: { enabled: false },
          },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const label = context.dataset.label;
            if (value == null) return `${label}: no data`;
            // Never print the clamp as if it were a measurement.
            const clamped = belowFloor?.[context.datasetIndex]?.[context.dataIndex];
            return `${label}: ${
              clamped ? "< 1e-100 (converged)" : value.toExponential(4)
            }`;
          },
        },
      },
    },
    scales: {
      [valueAxis]: valueScale,
      [categoryAxis]: categoryScale,
    },
  };

  const isLine = chartType === "line";
  const styledDatasets = datasets.map((dataset) => {
    const base = { ...dataset, borderWidth: 2, tension: 0.3, fill: isLine };
    if (!isLine) return base;

    const lineColor = first(dataset.borderColor) || first(dataset.backgroundColor);
    const pointColors = Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor
      : lineColor;

    return {
      ...base,
      borderColor: lineColor,
      backgroundColor: withAlpha(lineColor, FILL_ALPHA),
      pointBackgroundColor: pointColors,
      pointBorderColor: pointColors,
    };
  });

  const data = { labels, datasets: styledDatasets };
  const ChartComponent = chartType === "bar" ? Bar : Line;

  // Horizontal bars normally grow one row at a time and scroll. A zoomable
  // chart must not live inside a scroller — the wheel would fight the plugin —
  // so the focused view compresses to the band it was given instead.
  const scrollRows = horizontal && !zoomable;

  return (
    <Card className="border-none shadow-sm transition-all hover:shadow-md h-full flex flex-col">
      {!hideHeader && (
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-bold text-primary-900">
              {functionData.name}
            </CardTitle>
            {onExpand && (
              // A button, not a clickable card: the card is hovered constantly
              // for tooltips and would open the dialog by accident.
              <button
                type="button"
                onClick={onExpand}
                aria-label={`Focus ${functionData.name}`}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-600"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground bg-neutral-50 p-2 rounded-lg border border-gray-50 inline-block">
            <InlineMath math={functionData.description.replace(/\$/g, "")} />
          </div>
        </CardHeader>
      )}
      <CardContent
        className={`flex-1 min-h-[300px] ${scrollRows ? "overflow-y-auto" : ""}`}
      >
        <div
          style={
            scrollRows
              ? { height: `${labels.length * ROW_HEIGHT + 60}px` }
              : { height: "100%" }
          }
        >
          <ChartComponent ref={chartRef} options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FitnessChart;
