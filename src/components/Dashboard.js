import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FitnessChart from "./FitnessChart";
import CrossoverNavigation from "./CrossoverNavigation";
import SimulationsTable from "./SimulationsTable";
import ModelSelectorDialog from "./ModelSelectorDialog";
import ChartFocusDialog from "./ChartFocusDialog";
import { getFunctionNames } from "../data/fitnessData";
import { buildChartData, functionMeta } from "../data/chartSelection";
import { useSimulation } from "../context/SimulationContext";
import { DUMMY_SIMULATION_ID } from "../data/dummySimulation";
import {
  Plus,
  BarChart3,
  List,
  Loader2,
  Info,
  FlaskConical,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { formatFitness, mutationIdToName } from "../data/variantMappings";

// Today's behaviour, expressed in the new selection shape: one crossover, both
// selection methods, every mutation on the x-axis, no Top-N cap.
const DEFAULT_SELECTION = {
  mode: "quick",
  crossovers: ["exponential"],
  selections: ["sts", "greedy"],
  mutations: [...mutationIdToName],
  topN: null,
};

// Hoisted: `getFunctionNames()` returns a fresh array on every call, so calling
// it in the render body gave `analyticsData`'s useMemo a dep that always
// changed — rebuilding all ten charts on every poll tick.
const FUNCTION_KEYS = getFunctionNames();

const TOP_N_OPTIONS = [
  { value: "10", label: "Top 10" },
  { value: "20", label: "Top 20" },
  { value: "all", label: "All" },
];

function Dashboard() {
  const navigate = useNavigate();
  const {
    simulations,
    loading,
    error,
    fetchSimulations,
    deleteSimulation,
    loadDummySimulation,
    removeSimulation,
  } = useSimulation();
  const [viewMode, setViewMode] = useState("table");

  const [sel, setSel] = useState(DEFAULT_SELECTION);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [chartType, setChartType] = useState("bar");
  // Which function the focused dialog is showing; null when it is closed.
  const [focusKey, setFocusKey] = useState(null);

  // A single crossover button returns to quick mode; the custom modal owns the
  // rest of the state.
  const selectCrossover = (crossoverKey) =>
    setSel((prev) => ({ ...prev, mode: "quick", crossovers: [crossoverKey] }));

  const toggleSelection = (selectionKey) =>
    setSel((prev) => {
      const next = prev.selections.includes(selectionKey)
        ? prev.selections.filter((k) => k !== selectionKey)
        : [...prev.selections, selectionKey];
      // Never let both selection methods be off — the charts would go blank.
      return next.length === 0 ? prev : { ...prev, selections: next };
    });

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const analyticsData = useMemo(() => {
    const byFunction = {};
    FUNCTION_KEYS.forEach((functionKey) => {
      const meta = functionMeta(functionKey);
      if (!meta) return;
      const chart = buildChartData(functionKey, sel);
      if (chart.datasets.length === 0 || chart.labels.length === 0) return;
      byFunction[functionKey] = { meta, chart };
    });
    return byFunction;
  }, [sel]);

  const completedWithFitness = simulations.filter(
    (s) => s.bestFitness != null && Number.isFinite(Number(s.bestFitness))
  );
  const avgBest =
    completedWithFitness.length > 0
      ? completedWithFitness.reduce(
          (sum, sim) => sum + Number(sim.bestFitness),
          0
        ) / completedWithFitness.length
      : null;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
              Research Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyze and manage your Differential Evolution simulations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={loadDummySimulation}
              title="Add a locally generated demo run to try the charts and table — no backend needed"
              className="rounded-xl"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Use dummy data
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/api/import")}
              className="rounded-xl"
            >
              Import data
            </Button>
            <Button
              onClick={() => navigate("/api/simulator")}
              className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl shadow-lg shadow-accent-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Simulation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Simulations",
              value: simulations.length,
              color: "bg-blue-500",
            },
            {
              label: "Avg. Best Fitness",
              value:
                avgBest != null ? formatFitness(avgBest) : "N/A",
              color: "bg-emerald-500",
            },
            {
              label: "Active Jobs",
              value: simulations.filter(
                (sim) => sim.status === "running" || sim.status === "pending"
              ).length,
              color: "bg-amber-500",
            },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl opacity-10 flex items-center justify-center`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-primary-900">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View toggle */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {viewMode === "table"
              ? "Your simulation runs"
              : "Reference benchmark charts (static dataset)"}
          </p>
          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className="bg-neutral-50 p-1 rounded-xl"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="table"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <List className="w-4 h-4 mr-2" />
                Table
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Reference charts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading && simulations.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
            <span className="ml-3 text-muted-foreground">
              Loading simulations...
            </span>
          </div>
        ) : viewMode === "table" ? (
          <SimulationsTable
            simulations={simulations}
            loading={loading}
            error={error}
            onDelete={deleteSimulation}
            isDummySimulation={(sim) => sim.id === DUMMY_SIMULATION_ID}
            onRemoveDummy={() => removeSimulation(DUMMY_SIMULATION_ID)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50/60">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold">Reference dataset</p>
                <p className="text-blue-800/90 mt-0.5">
                  These charts show a built-in reference DE dataset for comparing
                  operators — not your personal simulation runs. Open a simulation
                  from the Table tab to inspect your own results.
                </p>
              </div>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-wrap items-center justify-between gap-6 p-6">
                <CrossoverNavigation
                  selection={sel}
                  onSelectCrossover={selectCrossover}
                  onOpenCustom={() => setSelectorOpen(true)}
                />

                <div className="flex items-center gap-4">
                  <Tabs
                    value={chartType}
                    onValueChange={setChartType}
                    className="bg-neutral-50 p-1 rounded-xl"
                  >
                    <TabsList className="bg-transparent">
                      <TabsTrigger
                        value="bar"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
                      >
                        Bar
                      </TabsTrigger>
                      <TabsTrigger
                        value="line"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
                      >
                        Line
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Tabs
                    value={sel.topN == null ? "all" : String(sel.topN)}
                    onValueChange={(value) =>
                      setSel((prev) => ({
                        ...prev,
                        topN: value === "all" ? null : Number(value),
                      }))
                    }
                    className="bg-neutral-50 p-1 rounded-xl"
                  >
                    <TabsList className="bg-transparent">
                      {TOP_N_OPTIONS.map((option) => (
                        <TabsTrigger
                          key={option.value}
                          value={option.value}
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
                        >
                          {option.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-lg font-bold border-2 ${
                        sel.selections.includes("sts")
                          ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          : "bg-white border-gray-100 text-muted-foreground"
                      }`}
                      onClick={() => toggleSelection("sts")}
                    >
                      STS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-lg font-bold border-2 ${
                        sel.selections.includes("greedy")
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                          : "bg-white border-gray-100 text-muted-foreground"
                      }`}
                      onClick={() => toggleSelection("greedy")}
                    >
                      GRD
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(analyticsData).map(([key, { meta, chart }]) => (
                <div key={key} className="h-[450px]">
                  <FitnessChart
                    functionData={meta}
                    labels={chart.labels}
                    datasets={chart.datasets}
                    belowFloor={chart.belowFloor}
                    horizontal={chart.horizontal}
                    chartType={chartType}
                    onExpand={() => setFocusKey(key)}
                  />
                </div>
              ))}
            </div>

            <ModelSelectorDialog
              open={selectorOpen}
              onOpenChange={setSelectorOpen}
              value={sel}
              onApply={setSel}
            />

            <ChartFocusDialog
              open={focusKey != null}
              onOpenChange={(next) => !next && setFocusKey(null)}
              functionKeys={FUNCTION_KEYS}
              activeKey={focusKey}
              onNavigate={setFocusKey}
              selection={sel}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
