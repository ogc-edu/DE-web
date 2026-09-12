import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { simulationService } from "../services/api";
import { simulationToDisplay } from "../data/variantMappings";

// How often to poll active (pending/running) simulations for live progress.
const POLL_INTERVAL_MS = 5000;
const ACTIVE_STATUSES = ["pending", "running"];

const SimulationContext = createContext(undefined, undefined);

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollTimerRef = useRef(null);
  // Keep a render-latest mirror so interval callbacks never read stale state.
  const simulationsRef = useRef(simulations);
  simulationsRef.current = simulations;

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const fetchSimulations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await simulationService.getAll();
      setSimulations(response.data.map(simulationToDisplay));
    } catch (err) {
      console.error("Error fetching simulations:", err);
      // Do NOT silently swap in mock data — surface the real backend error so
      // broken wiring is visible. (The former src/data/mockData.js fallback was
      // removed in Feature 001; demo/reference charts use fitnessData.js.)
      setError(err.message || "Failed to load simulations");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSimulation = useCallback(async (id) => {
    try {
      await simulationService.delete(id);
      setSimulations((prev) => prev.filter((sim) => sim.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting simulation:", err);
      setError(err.message);
      return false;
    }
  }, []);

  const addSimulation = useCallback((simulation) => {
    setSimulations((prev) => [simulation, ...prev]);
  }, []);

  // Fetch the live status/progress/results for one simulation and merge it into
  // the display record. Called on a 5s cadence for pending/running simulations.
  const pollActiveSimulations = useCallback(async () => {
    const active = simulationsRef.current.filter((sim) =>
      ACTIVE_STATUSES.includes(sim.status)
    );
    if (active.length === 0) {
      stopPolling();
      return;
    }
    await Promise.all(
      active.map(async (sim) => {
        try {
          const { data } = await simulationService.getResults(sim.id);
          setSimulations((prev) =>
            prev.map((s) => {
              if (s.id !== sim.id) return s;
              const rows = Array.isArray(data.simulationData)
                ? data.simulationData
                : s.simulationData;
              const values = (rows || [])
                .map((r) => r?.lowestFitness)
                .filter((v) => v != null && Number.isFinite(Number(v)))
                .map(Number);
              const bestFitness =
                values.length > 0 ? Math.min(...values) : s.bestFitness;
              return {
                ...s,
                status: data.status ?? s.status,
                progress: data.progress ?? s.progress,
                completedModels: data.completedModels ?? s.completedModels,
                simulationData: rows || s.simulationData || [],
                bestFitness,
              };
            })
          );
        } catch (err) {
          // Transient polling failure — keep the last known values and move on;
          // do not flood the global error banner at a 5s cadence.
          console.error(`Error polling simulation ${sim.id}:`, err);
        }
      })
    );
  }, [stopPolling]);

  // Start polling as soon as any simulation is pending/running; stop it as soon
  // as every simulation reaches a terminal state (completed/failed/cancelled).
  useEffect(() => {
    const hasActive = simulations.some((sim) =>
      ACTIVE_STATUSES.includes(sim.status)
    );
    if (hasActive) {
      if (!pollTimerRef.current) {
        pollTimerRef.current = setInterval(
          pollActiveSimulations,
          POLL_INTERVAL_MS
        );
        // Kick off an immediate first poll instead of waiting 5s.
        pollActiveSimulations();
      }
    } else {
      stopPolling();
    }
  }, [simulations, pollActiveSimulations, stopPolling]);

  // Clear any pending timer on unmount.
  useEffect(() => () => stopPolling(), [stopPolling]);

  return (
    <SimulationContext.Provider
      value={{
        activeSimulation,
        setActiveSimulation,
        isSimulating,
        setIsSimulating,
        simulations,
        setSimulations,
        loading,
        error,
        fetchSimulations,
        deleteSimulation,
        addSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
