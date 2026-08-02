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
import { Bar, Line } from "react-chartjs-2";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FitnessChart = ({
  functionData,
  crossoverMethod = "all",
  showSTS = true,
  showGreedy = true,
  chartType = "bar",
}) => {
  if (!functionData || !functionData.models) {
    return (
      <Card className="border-none shadow-sm h-full flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          No experimental data available for this configuration
        </p>
      </Card>
    );
  }

  const stsModels = functionData.models.filter(
    (model) => model.selection === "sts"
  );
  const greedyModels = functionData.models.filter(
    (model) => model.selection === "greedy"
  );
  const allModelNames = [
    ...new Set(functionData.models.map((model) => model.model)),
  ];

  const processData = (models) => {
    return allModelNames.map((modelName) => {
      const model = models.find((m) => m.model === modelName);
      if (!model) return null;
      let value = model.avgLowestFitness;
      return value === 0 || value < 1e-100 ? 1e-100 : value;
    });
  };

  const stsData = processData(stsModels);
  const greedyData = processData(greedyModels);

  const allValues = [...stsData, ...greedyData].filter(
    (v) => v !== null && v > 1e-99
  );
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const useLogScale = allValues.length > 0 && maxValue / minValue > 1000;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            const label = context.dataset.label;
            return `${label}: ${
              val === 1e-100 ? "0.0000e+00" : val.toExponential(4)
            }`;
          },
        },
      },
    },
    scales: {
      y: {
        type: useLogScale ? "logarithmic" : "linear",
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { size: 10 },
          callback: (value) =>
            value === 1e-100 ? "0" : value.toExponential(0),
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 },
      },
    },
  };

  const datasets = [];
  if (showSTS && stsModels.length > 0) {
    datasets.push({
      label: "STS Selection",
      data: stsData,
      backgroundColor: "rgba(37, 99, 235, 0.6)",
      borderColor: "#2563eb",
      borderWidth: 2,
      tension: 0.3,
      fill: chartType === "line",
    });
  }
  if (showGreedy && greedyModels.length > 0) {
    datasets.push({
      label: "Greedy Selection",
      data: greedyData,
      backgroundColor: "rgba(16, 185, 129, 0.6)",
      borderColor: "#10b981",
      borderWidth: 2,
      tension: 0.3,
      fill: chartType === "line",
    });
  }

  const data = { labels: allModelNames, datasets };
  const ChartComponent = chartType === "bar" ? Bar : Line;

  return (
    <Card className="border-none shadow-sm transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-primary-900">
          {functionData.name}
        </CardTitle>
        <div className="mt-1 text-xs text-muted-foreground bg-neutral-50 p-2 rounded-lg border border-gray-50 inline-block">
          <InlineMath math={functionData.description.replace(/\$/g, "")} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartComponent options={options} data={data} />
      </CardContent>
    </Card>
  );
};

export default FitnessChart;
