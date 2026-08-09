import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SimulationProvider } from "./context/SimulationContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Simulator from "./components/Simulator";
import Portfolio from "./components/Portfolio";
import SimulationHistory from "./components/SimulationHistory";
import AccountSettings from "./components/AccountSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <Router>
          <Routes>
            <Route path="/api/login" element={<Login />} />
            <Route path="/api/register" element={<Register />} />
            <Route
              path="/api"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api/simulator"
              element={
                <ProtectedRoute>
                  <Simulator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api/data"
              element={
                <ProtectedRoute>
                  <SimulationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api/settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SimulationProvider>
    </AuthProvider>
  );
}


export default App;
