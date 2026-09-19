import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Plus,
  Upload,
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
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "../lib/utils";
import { formatFitness } from "../data/variantMappings";
import { DUMMY_SIMULATION_ID } from "../data/dummySimulation";
import { simulationService } from "../services/api";

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Completed",
  },
  running: {
    icon: Loader2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Running",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Pending",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Failed",
  },
  cancelled: {
    icon: XCircle,
    color: "text-gray-600",
    bg: "bg-gray-100",
    label: "Cancelled",
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.bg,
        config.color
      )}
    >
      <Icon
        className={cn("w-3.5 h-3.5", status === "running" && "animate-spin")}
      />
      {config.label}
    </span>
  );
};

const exportSimulationCsv = (sim) => {
  const rows = Array.isArray(sim.simulationData) ? sim.simulationData : [];
  const header = [
    "functionId",
    "mutationId",
    "crossoverId",
    "selectionId",
    "lowestFitness",
  ];
  const lines = [header.join(",")];
  rows.forEach((r) => {
    lines.push(
      [
        r.functionId,
        r.mutationId,
        r.crossoverId,
        r.selectionId,
        r.lowestFitness,
      ].join(",")
    );
  });
  // Params preamble as comments so researchers keep the DE settings.
  const meta = [
    `# simulationId=${sim.id}`,
    `# status=${sim.status || ""}`,
    `# np=${sim.np ?? ""} f=${sim.f ?? ""} cr=${sim.cr ?? ""} gen=${sim.generations ?? ""} dim=${sim.dimension ?? ""}`,
    `# models=${sim.totalModels ?? rows.length}`,
  ];
  const blob = new Blob([[...meta, ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `simulation-${sim.id || "export"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Shared simulations table used by Dashboard and Simulation History.
 * Always-visible actions (no hover-only), honest empty state, confirm delete.
 */
export default function SimulationsTable({
  simulations,
  loading = false,
  error = null,
  onDelete,
  showStatusFilter = false,
  emptyTitle = "No simulations yet",
  emptyDescription = "Run a DE experiment or import a .txt results file to get started.",
  isDummySimulation = (sim) => sim?.id === DUMMY_SIMULATION_ID,
  onRemoveDummy,
  className,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBenchmark, setFilterBenchmark] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [exportingId, setExportingId] = useState(null);
  const [exportError, setExportError] = useState(null);

  const benchmarkOptions = useMemo(() => {
    const set = new Set();
    simulations.forEach((s) => {
      (s.functionNames || []).forEach((n) => set.add(n));
      if (s.benchmark && s.benchmark !== "N/A") {
        // Also allow joined string matches for older display records.
        s.benchmark.split(", ").forEach((n) => set.add(n));
      }
    });
    return Array.from(set).filter(Boolean).sort();
  }, [simulations]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...simulations];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (sim) =>
          sim.modelSummary?.toLowerCase().includes(q) ||
          sim.model?.toLowerCase().includes(q) ||
          sim.benchmark?.toLowerCase().includes(q) ||
          sim.status?.toLowerCase().includes(q) ||
          String(sim.id || "").toLowerCase().includes(q)
      );
    }

    if (filterBenchmark !== "all") {
      result = result.filter(
        (sim) =>
          (sim.functionNames || []).includes(filterBenchmark) ||
          sim.benchmark === filterBenchmark ||
          (sim.benchmark || "").includes(filterBenchmark)
      );
    }

    if (showStatusFilter && filterStatus !== "all") {
      result = result.filter((sim) => sim.status === filterStatus);
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    simulations,
    searchQuery,
    filterBenchmark,
    filterStatus,
    sortConfig,
    showStatusFilter,
  ]);

  // The list endpoint no longer ships result rows (they live in a separate
  // `simulation_results` table). Fetch them lazily on demand so the CSV button
  // stays usable for list records that only carry the denormalized bestFitness.
  const handleExportCsv = async (sim) => {
    setExportError(null);
    const hasRows =
      Array.isArray(sim.simulationData) && sim.simulationData.length > 0;
    let record = sim;
    if (!hasRows) {
      setExportingId(sim.id);
      try {
        const { data } = await simulationService.getResults(sim.id);
        record = {
          ...sim,
          simulationData: Array.isArray(data?.simulationData)
            ? data.simulationData
            : [],
        };
      } catch (err) {
        console.error(`Error fetching results for ${sim.id}:`, err);
        setExportError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to download results"
        );
        return;
      } finally {
        setExportingId(null);
      }
    }
    exportSimulationCsv(record);
  };

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    // The dummy demo run is client-side only — remove it locally and never
    // hit the API (the backend would 404/400 on an unknown id).
    if (isDummySimulation(pendingDelete)) {
      setPendingDelete(null);
      onRemoveDummy?.();
      return;
    }
    setDeleting(true);
    try {
      await onDelete(pendingDelete.id);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const isFirstRunEmpty =
    !loading && simulations.length === 0 && !searchQuery && filterBenchmark === "all" && filterStatus === "all";

  return (
    <div className={cn("space-y-4", className)}>
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

      {exportError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Failed to download CSV
            </p>
            <p className="text-sm text-red-600">{exportError}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search simulations..."
              className="pl-10 bg-neutral-50 border-none rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterBenchmark} onValueChange={setFilterBenchmark}>
            <SelectTrigger className="w-full sm:w-[200px] bg-neutral-50 border-none rounded-xl">
              <SelectValue placeholder="All Benchmarks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Benchmarks</SelectItem>
              {benchmarkOptions.map((fn) => (
                <SelectItem key={fn} value={fn}>
                  {fn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showStatusFilter && (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px] bg-neutral-50 border-none rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <p className="text-sm text-muted-foreground shrink-0">
          {filteredAndSorted.length} of {simulations.length} simulations
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
          <span className="ml-3 text-muted-foreground">
            Loading simulations...
          </span>
        </div>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="min-w-[180px] font-bold">
                    Mutations
                  </TableHead>
                  <TableHead
                    className="font-bold cursor-pointer hover:text-accent-600 transition-colors min-w-[160px]"
                    onClick={() => handleSort("benchmark")}
                  >
                    <div className="flex items-center gap-2">
                      Benchmarks
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
                  <TableRow
                    key={sim.id}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/api/simulations/${sim.id}`)}
                  >
                    <TableCell className="py-4">
                      <span className="font-semibold text-primary-900">
                        {sim.modelSummary || sim.model || "N/A"}
                      </span>
                      {isDummySimulation(sim) && (
                        <span
                          title="Locally generated demo data — not stored on the server"
                          className="ml-2 align-middle inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-purple-50 text-purple-600 border border-purple-200"
                        >
                          Demo
                        </span>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                        NP:{sim.np ?? "N/A"} F:{sim.f ?? "N/A"} Cr:
                        {sim.cr ?? "N/A"}
                        {sim.totalModels != null ? ` · ${sim.totalModels} models` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium line-clamp-2">
                        {sim.benchmark}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-accent-600">
                      {formatFitness(sim.bestFitness)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={sim.status || "pending"} />
                      {(sim.status === "pending" || sim.status === "running") && (
                        <div className="mt-2 w-28">
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent-600 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(sim.progress ?? 0, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {sim.progress ?? 0}% · {sim.completedModels ?? 0}/
                            {sim.totalModels ?? "?"} models
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {sim.timestamp
                          ? new Date(sim.timestamp).toLocaleDateString()
                          : "—"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {sim.timestamp
                          ? new Date(sim.timestamp).toLocaleTimeString()
                          : ""}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent-50 text-muted-foreground hover:text-accent-600"
                          title="View details"
                          onClick={() => navigate(`/api/simulations/${sim.id}`)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent-50 text-muted-foreground hover:text-accent-600"
                          title="Download CSV"
                          disabled={exportingId === sim.id}
                          onClick={() => handleExportCsv(sim)}
                        >
                          {exportingId === sim.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 text-muted-foreground hover:text-red-600"
                            title="Delete"
                            onClick={() => setPendingDelete(sim)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSorted.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
                {isFirstRunEmpty ? (
                  <Plus className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <Filter className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-primary-900">
                {isFirstRunEmpty ? emptyTitle : "No results found"}
              </h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                {isFirstRunEmpty
                  ? emptyDescription
                  : "Try adjusting your search or filters."}
              </p>
              {isFirstRunEmpty && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Button
                    onClick={() => navigate("/api/simulator")}
                    className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Run simulation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/api/import")}
                    className="rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import data
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete simulation?</DialogTitle>
            <DialogDescription>
              This permanently removes the simulation
              {pendingDelete?.id ? ` (${pendingDelete.id})` : ""} and its
              results. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={deleting}
              onClick={() => setPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { exportSimulationCsv };
