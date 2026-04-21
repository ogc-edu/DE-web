import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SimulationProvider } from "./context/SimulationContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Simulator from "./components/Simulator";
import Portfolio from "./components/Portfolio";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <Router>
          <Routes>
            <Route path="/api" element={<Dashboard />} />
            <Route path="/api/login" element={<Login />} />
            <Route path="/api/register" element={<Register />} />
            <Route path="/api/simulator" element={<Simulator />} />
            <Route path="/api/portfolio" element={<Portfolio />} />
          </Routes>
        </Router>
      </SimulationProvider>
    </AuthProvider>
  );
}


export default App;
