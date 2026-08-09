import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FitnessChart from "./FitnessChart";
import CrossoverNavigation from "./CrossoverNavigation";
import { functionIdToName } from "../data/variantMappings";
import {
  getFunctionNames,
  getFunctionDataByCrossoverAndSelection,
} from "../data/fitnessData";
import { useSimulation } from "../context/SimulationContext";
import {
  Search,
  ArrowUpDown,
  Trash2,
  Download,
  ExternalLink,
  Plus,
  BarChart3,
  List,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Dashboard() {
  const navigate = useNavigate();
  const { simulations, loading, fetchSimulations, deleteSimulation } = useSimulation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBenchmark, setFilterBenchmark] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState("table");

  const [activeCrossover, setActiveCrossover] = useState("exponential");
  const [showSTS, setShowSTS] = useState(true);
  const [showGreedy, setShowGreedy] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const functionNames = getFunctionNames();

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSimulations = useMemo(() => {
    let result = [...simulations];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sim) =>
          sim.model?.toLowerCase().includes(query) ||
          sim.benchmark?.toLowerCase().includes(query) ||
          sim.status?.toLowerCase().includes(query)
      );
    }

    if (filterBenchmark !== "all") {
      result = result.filter((sim) => sim.benchmark === filterBenchmark);
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [simulations, searchQuery, filterBenchmark, sortConfig]);

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

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this simulation record?")
    ) {
      await deleteSimulation(id);
    }
  };

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
          <div className="flex items-center gap-3">
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
              value: simulations.length > 0
                ? (simulations.reduce((sum, sim) => sum + (sim.bestFitness || 0), 0) / simulations.length).toExponential(2)
                : "N/A",
              color: "bg-emerald-500",
            },
            {
              label: "Active Jobs",
              value: simulations.filter((sim) => sim.status === "running" || sim.status === "pending").length,
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

        {/* Filters and View Toggles */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search simulations..."
                className="pl-10 bg-neutral-50 border-none rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterBenchmark} onValueChange={setFilterBenchmark}>
              <SelectTrigger className="w-full md:w-[200px] bg-neutral-50 border-none rounded-xl">
                <SelectValue placeholder="All Benchmarks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Benchmarks</SelectItem>
                {functionIdToName.map((fn) => (
                  <SelectItem key={fn} value={fn}>
                    {fn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Data Table / Analytics View */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
            <span className="ml-3 text-muted-foreground">Loading simulations...</span>
          </div>
        ) : viewMode === "table" ? (
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="w-[200px] font-bold">
                    Model Variant
                  </TableHead>
                  <TableHead
                    className="font-bold cursor-pointer hover:text-accent-600 transition-colors"
                    onClick={() => handleSort("benchmark")}
                  >
                    <div className="flex items-center gap-2">
                      Benchmark
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold cursor-pointer hover:text-accent-600 transition-colors text-right"
                    onClick={() => handleSort("bestFitness")}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      Best Fitness
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold cursor-pointer hover:text-accent-600 transition-colors"
                    onClick={() => handleSort("timestamp")}
                  >
                    <div className="flex items-center gap-2">
                      Timestamp
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSimulations.map((sim) => (
                  <TableRow
                    key={sim.id}
                    className="group hover:bg-neutral-50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <span className="font-semibold text-primary-900">
                        {sim.model}
                      </span>
                      <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                        NP:{sim.np ?? "N/A"} F:{sim.f ?? "N/A"} Cr:{sim.cr ?? "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium">
                        {sim.benchmark}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-accent-600">
                      {sim.bestFitness != null ? sim.bestFitness.toExponential(4) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(sim.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(sim.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent-50 text-muted-foreground hover:text-accent-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent-50 text-muted-foreground hover:text-accent-600"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 text-muted-foreground hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => handleDelete(sim.id)}
                            >
                              Confirm Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAndSortedSimulations.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or run a new simulation.
                </p>
              </div>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
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
