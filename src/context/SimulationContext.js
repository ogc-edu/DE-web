import React, { createContext, useState, useContext, useCallback } from "react";
import { simulationService } from "../services/api";
import { mockSimulations } from "../data/mockData";
import { simulationToDisplay } from "../data/variantMappings";

const SimulationContext = createContext(undefined, undefined);

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSimulations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await simulationService.getAll();
      setSimulations(response.data.map(simulationToDisplay));
    } catch (err) {
      console.error("Error fetching simulations:", err);
      setError(err.message);
      setSimulations(mockSimulations);
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
