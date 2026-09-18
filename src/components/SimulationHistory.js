import React, { useEffect } from "react";
import Layout from "./Layout";
import SimulationsTable from "./SimulationsTable";
import { useSimulation } from "../context/SimulationContext";
import { DUMMY_SIMULATION_ID } from "../data/dummySimulation";

const SimulationHistory = () => {
  const {
    simulations,
    loading,
    error,
    fetchSimulations,
    deleteSimulation,
    removeSimulation,
  } = useSimulation();

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

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

        <SimulationsTable
          simulations={simulations}
          loading={loading}
          error={error}
          onDelete={deleteSimulation}
          showStatusFilter
          onRemoveDummy={() => removeSimulation(DUMMY_SIMULATION_ID)}
        />
      </div>
    </Layout>
  );
};

export default SimulationHistory;
