import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SimulationProvider } from "./context/SimulationContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Simulator from "./components/Simulator";
import ImportData from "./components/ImportData";
import SimulationDetail from "./components/SimulationDetail";
import Portfolio from "./components/Portfolio";
import SimulationHistory from "./components/SimulationHistory";
import AccountSettings from "./components/AccountSettings";
import AdminQueue from "./components/AdminQueue";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Feeds the current pathname to the boundary as its reset key, so navigating
// away from a route that threw clears the fallback. Must live inside <Router>.
function RouteErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <Router>
          <RouteErrorBoundary>
            <Routes>
              {/* The deployed site root is "/" — send it to the app instead of 404. */}
              <Route path="/" element={<Navigate to="/api" replace />} />
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
                path="/api/import"
                element={
                  <ProtectedRoute>
                    <ImportData />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/api/simulations/:id"
                element={
                  <ProtectedRoute>
                    <SimulationDetail />
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
              <Route
                path="/api/admin"
                element={
                  <ProtectedRoute>
                    <AdminQueue />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all: any unknown path renders NotFound, never a blank page. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteErrorBoundary>
        </Router>
      </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
