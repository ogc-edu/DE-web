import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import { useSimulation } from "../context/SimulationContext";
import { simulationService } from "../services/api";
import { simulationToDisplay, formatFitness, modelNameFromIds, functionIdToName } from "../data/variantMappings";
import {
  createDummySimulation,
  DUMMY_SIMULATION_ID,
} from "../data/dummySimulation";
import { exportSimulationCsv, StatusBadge } from "./SimulationsTable";
import {
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

const SimulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteSimulation, fetchSimulations } = useSimulation();

  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    // The dummy demo run is generated client-side (DUMMY_SIMULATION_ID does
    // not exist in the database) — render it locally without any API calls.
    if (id === DUMMY_SIMULATION_ID) {
      setSim(simulationToDisplay(createDummySimulation()));
      setLoading(false);
      return;
    }
    try {
      // Prefer the results endpoint (includes simulationData + live status).
      const resultsRes = await simulationService.getResults(id);
      let base = {};
      try {
        const fullRes = await simulationService.getById(id);
        base = fullRes.data?.simulation || fullRes.data || {};
      } catch (e) {
        // results alone is enough for the grid
      }
      const merged = {
        ...base,
        _id: base._id || resultsRes.data.simulationId || id,
        status: resultsRes.data.status ?? base.status,
        totalModels: resultsRes.data.totalModels ?? base.totalModels,
        completedModels: resultsRes.data.completedModels ?? base.completedModels,
        progress: resultsRes.data.progress ?? base.progress,
        simulationData: resultsRes.data.simulationData ?? base.simulationData ?? [],
      };
      setSim(simulationToDisplay(merged));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load simulation"
      );
      setSim(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Light poll while in-flight.
  useEffect(() => {
    if (!sim || (sim.status !== "pending" && sim.status !== "running")) return undefined;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim?.status, id]);

  const rows = useMemo(() => {
    const data = Array.isArray(sim?.simulationData) ? sim.simulationData : [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((r) => {
      const name = modelNameFromIds(r.mutationId, r.crossoverId, r.selectionId).toLowerCase();
      const fn = (functionIdToName[r.functionId - 1] || "").toLowerCase();
      return (
        name.includes(q) ||
        fn.includes(q) ||
        String(r.functionId).includes(q) ||
        String(r.lowestFitness).includes(q)
      );
    });
  }, [sim, search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const ok = await deleteSimulation(id);
      if (ok) {
        await fetchSimulations();
        navigate("/api");
      }
    } finally {
      setDeleting(false);
      setPendingDelete(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500 font-sans max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
              Simulation details
              {id === DUMMY_SIMULATION_ID && (
                <span className="ml-3 align-middle inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-purple-50 text-purple-600 border border-purple-200">
                  Demo data
                </span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm break-all">
              ID: {id}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={!sim?.simulationData?.length}
              onClick={() => sim && exportSimulationCsv(sim)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            {sim?.id !== DUMMY_SIMULATION_ID && (
              <Button
                variant="outline"
                className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setPendingDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">Could not load simulation</p>
              <p className="text-sm text-red-600">{error}</p>
              <Link to="/api" className="text-sm text-accent-600 font-medium mt-2 inline-block">
                Return to dashboard
              </Link>
            </div>
          </div>
        )}

        {loading && !sim ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
            <span className="ml-3 text-muted-foreground">Loading…</span>
          </div>
        ) : sim ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Configuration</CardTitle>
                  <CardDescription>DE parameters and selected operators</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={sim.status || "pending"} />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Models</p>
                    <p className="font-semibold">
                      {sim.completedModels ?? 0}/{sim.totalModels ?? "?"}
                      {sim.progress != null ? ` · ${sim.progress}%` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Best fitness</p>
                    <p className="font-mono font-semibold text-accent-600">
                      {formatFitness(sim.bestFitness)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">NP / F / Cr</p>
                    <p className="font-semibold">
                      {sim.np ?? "—"} / {sim.f ?? "—"} / {sim.cr ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Gen / Dim</p>
                    <p className="font-semibold">
                      {sim.generations ?? "—"} / {sim.dimension ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="font-semibold">
                      {sim.timestamp
                        ? new Date(sim.timestamp).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs">Mutations</p>
                    <p className="font-medium">{sim.modelSummary || sim.model}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-muted-foreground text-xs">Benchmarks</p>
                    <p className="font-medium">{sim.benchmark}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Results</CardTitle>
                  <CardDescription>
                    {(sim.simulationData || []).length} row
                    {(sim.simulationData || []).length === 1 ? "" : "s"} · lower is better
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Each row is one (model × benchmark) average-of-lowest fitness
                    value stored by the worker or import.
                  </p>
                  {(sim.status === "pending" || sim.status === "running") && (
                    <p className="text-blue-600 font-medium">
                      This job is still running — results update automatically.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">Results grid</CardTitle>
                  <CardDescription>
                    Showing {rows.length} of {(sim.simulationData || []).length}
                  </CardDescription>
                </div>
                <Input
                  placeholder="Filter model or benchmark…"
                  className="sm:w-64 bg-neutral-50 border-none rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CardHeader>
              <CardContent className="p-0">
                {(sim.simulationData || []).length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground text-sm">
                    {sim.status === "pending" || sim.status === "running"
                      ? "No results yet — waiting for the worker."
                      : "No result rows for this simulation."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-neutral-50">
                        <TableRow>
                          <TableHead className="font-bold">Model</TableHead>
                          <TableHead className="font-bold">Benchmark</TableHead>
                          <TableHead className="font-bold text-right">
                            Lowest fitness
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((r, idx) => (
                          <TableRow key={`${r.mutationId}-${r.crossoverId}-${r.selectionId}-${r.functionId}-${idx}`}>
                            <TableCell className="font-medium">
                              {modelNameFromIds(
                                r.mutationId,
                                r.crossoverId,
                                r.selectionId
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {functionIdToName[r.functionId - 1] ||
                                `F${r.functionId}`}
                            </TableCell>
                            <TableCell className="text-right font-mono text-accent-600">
                              {formatFitness(r.lowestFitness)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {rows.length === 0 && (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No rows match your filter.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}

        <Dialog
          open={pendingDelete}
          onOpenChange={(open) => !open && !deleting && setPendingDelete(false)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete simulation?</DialogTitle>
              <DialogDescription>
                This permanently removes the simulation and its results.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={deleting}
                onClick={() => setPendingDelete(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                disabled={deleting}
                onClick={handleDelete}
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
    </Layout>
  );
};

export default SimulationDetail;
