import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "./Layout";
import { adminService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  Inbox,
  EyeOff,
  Clock,
  Timer,
  ShieldAlert,
  Activity,
} from "lucide-react";

// Poll the SQS queue metrics every 10s while the page is open.
const POLL_INTERVAL_MS = 10000;

// OldestMessageAge comes back in seconds; render a human-friendly duration.
const formatAge = (seconds) => {
  if (seconds == null || isNaN(seconds)) return "N/A";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (totalMinutes < 60) return `${totalMinutes}m ${remainingSeconds}s`;
  const hours = Math.floor(totalMinutes / 60);
  return `${hours}h ${totalMinutes % 60}m ${remainingSeconds}s`;
};

const StatCard = ({ icon: Icon, label, value, hint, accent }) => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${accent || "text-primary-900"}`}>
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent ? "bg-blue-50" : "bg-neutral-100"}`}>
          <Icon className={`w-5 h-5 ${accent || "text-muted-foreground"}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminQueue() {
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);

  const isAdmin = user?.role === "admin";

  const fetchQueue = useCallback(async () => {
    try {
      const { data } = await adminService.getQueueStatus();
      setQueue(data.queue);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("Admin access required (the server rejected this account).");
      } else if (status === 503) {
        setError("SQS queue is not configured on the server (SQS_QUEUE_URL missing).");
      } else {
        setError(err.message || "Failed to load queue metrics.");
      }
      setQueue(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Non-admins never hit the API (the server would 403 anyway).
    if (!isAdmin) {
      setLoading(false);
      return undefined;
    }
    fetchQueue();
    timerRef.current = setInterval(fetchQueue, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [isAdmin, fetchQueue]);

  if (!isAdmin) {
    return (
      <Layout>
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
              Admin Queue Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              SQS queue monitoring is restricted to administrators.
            </p>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-6">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-700">Access denied</p>
                <p className="text-sm text-red-600">
                  You need an admin account to view queue metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
              Admin Queue Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Live AWS SQS queue depth — gauges how much work the EC2 workers have.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <Button
              onClick={fetchQueue}
              disabled={loading}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Failed to load queue metrics
              </p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading && !queue && !error ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
            <span className="ml-3 text-muted-foreground">Loading queue metrics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Inbox}
              label="In Queue"
              value={queue?.approximateNumberOfMessages ?? "N/A"}
              hint="Messages waiting for a worker"
              accent="text-blue-600"
            />
            <StatCard
              icon={EyeOff}
              label="In Flight"
              value={queue?.approximateNumberOfMessagesNotVisible ?? "N/A"}
              hint="Being processed (not visible)"
              accent="text-amber-600"
            />
            <StatCard
              icon={Clock}
              label="Delayed"
              value={queue?.approximateNumberOfMessagesDelayed ?? "N/A"}
              hint="Messages in delay state"
              accent="text-purple-600"
            />
            <StatCard
              icon={Timer}
              label="Oldest Message Age"
              value={formatAge(queue?.oldestMessageAge)}
              hint="Age of the oldest queued message"
              accent="text-emerald-600"
            />
          </div>
        )}

        {queue && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-600" />
                Queue Details
              </CardTitle>
              <CardDescription className="break-all">
                {queue.queueUrl}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Metrics refresh automatically every 10 seconds. Values are
              approximate per AWS SQS.
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
