import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FitnessChart from "./FitnessChart";
import CrossoverNavigation from "./CrossoverNavigation";
import SimulationsTable from "./SimulationsTable";
import {
  getFunctionNames,
  getFunctionDataByCrossoverAndSelection,
} from "../data/fitnessData";
import { useSimulation } from "../context/SimulationContext";
import {
  Plus,
  BarChart3,
  List,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { formatFitness } from "../data/variantMappings";

function Dashboard() {
  const navigate = useNavigate();
  const { simulations, loading, error, fetchSimulations, deleteSimulation } =
    useSimulation();
  const [viewMode, setViewMode] = useState("table");

  const [activeCrossover, setActiveCrossover] = useState("exponential");
  const [showSTS, setShowSTS] = useState(true);
  const [showGreedy, setShowGreedy] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const functionNames = getFunctionNames();

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const analyticsData = useMemo(() => {
    const filteredData = {};
    functionNames.forEach((functionName) => {
      const combinedModels = [];
      if (showSTS) {
        const crossoverMethodsToFetch =
          activeCrossover === "all"
            ? ["exponential", "binomial", "onepoint", "twopoint"]
            : [activeCrossover];

        crossoverMethodsToFetch.forEach((c) => {
          const data = getFunctionDataByCrossoverAndSelection(
            c,
            "sts",
            functionName
          );
          if (data?.models) combinedModels.push(...data.models);
        });
      }
      if (showGreedy) {
        const crossoverMethodsToFetch =
          activeCrossover === "all"
            ? ["exponential", "binomial", "onepoint", "twopoint"]
            : [activeCrossover];

        crossoverMethodsToFetch.forEach((c) => {
          const data = getFunctionDataByCrossoverAndSelection(
            c,
            "greedy",
            functionName
          );
          if (data?.models) combinedModels.push(...data.models);
        });
      }

      if (combinedModels.length > 0) {
        const baseData = getFunctionDataByCrossoverAndSelection(
          "exponential",
          "sts",
          functionName
        );
        if (baseData) {
          filteredData[functionName] = {
            name: baseData.name,
            description: baseData.description,
            models: combinedModels,
          };
        }
      }
    });
    return filteredData;
  }, [activeCrossover, showSTS, showGreedy, functionNames]);

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
                  activeCrossover={activeCrossover}
                  onCrossoverChange={setActiveCrossover}
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

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-lg font-bold border-2 ${
                        showSTS
                          ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          : "bg-white border-gray-100 text-muted-foreground"
                      }`}
                      onClick={() => setShowSTS(!showSTS)}
                    >
                      STS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-lg font-bold border-2 ${
                        showGreedy
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                          : "bg-white border-gray-100 text-muted-foreground"
                      }`}
                      onClick={() => setShowGreedy(!showGreedy)}
                    >
                      GRD
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(analyticsData).map(([name, data]) => (
                <div key={name} className="h-[450px]">
                  <FitnessChart
                    functionData={data}
                    crossoverMethod={activeCrossover}
                    showSTS={showSTS}
                    showGreedy={showGreedy}
                    chartType={chartType}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
