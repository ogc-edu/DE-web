import React, { useState, useMemo, useEffect } from "react";
import Layout from "./Layout";
import { functionIdToName } from "../data/variantMappings";
import { useSimulation } from "../context/SimulationContext";
import {
  Search,
  ArrowUpDown,
  Trash2,
  Filter,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Completed" },
  running: { icon: Loader2, color: "text-blue-600", bg: "bg-blue-50", label: "Running" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
};

const SimulationHistory = () => {
  const { simulations, loading, error, fetchSimulations, deleteSimulation } = useSimulation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBenchmark, setFilterBenchmark] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });

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

  const filteredAndSorted = useMemo(() => {
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

    if (filterStatus !== "all") {
      result = result.filter((sim) => sim.status === filterStatus);
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [simulations, searchQuery, filterBenchmark, filterStatus, sortConfig]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this simulation record?")) {
      await deleteSimulation(id);
    }
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", config.bg, config.color)}>
        <Icon className={cn("w-3.5 h-3.5", status === "running" && "animate-spin")} />
        {config.label}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
            Simulation History
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage all your past simulation runs
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Failed to load simulations
              </p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

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
                  <SelectItem key={fn} value={fn}>{fn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[160px] bg-neutral-50 border-none rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredAndSorted.length} of {simulations.length} simulations
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
            <span className="ml-3 text-muted-foreground">Loading simulations...</span>
          </div>
        ) : (
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="font-bold">Model</TableHead>
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
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead
                    className="font-bold cursor-pointer hover:text-accent-600 transition-colors"
                    onClick={() => handleSort("timestamp")}
                  >
                    <div className="flex items-center gap-2">
                      Timestamp
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.map((sim) => (
                  <TableRow key={sim.id} className="group hover:bg-neutral-50 transition-colors">
                    <TableCell className="py-4">
                      <span className="font-semibold text-primary-900">{sim.model}</span>
                      <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                        NP:{sim.np ?? "N/A"} F:{sim.f ?? "N/A"} Cr:{sim.cr ?? "N/A"} Dim:{sim.dimension ?? sim.dim ?? "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium">
                        {sim.benchmark}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-accent-600">
                      {sim.bestFitness ? sim.bestFitness.toExponential(4) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sim.status || "completed"} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(sim.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(sim.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAndSorted.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your filters.</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SimulationHistory;
