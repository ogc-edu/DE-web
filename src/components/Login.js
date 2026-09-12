import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getApiErrorMessage } from "../lib/apiError";
import { cn } from "../lib/utils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // `shownAlert` drives whether the slot is open; `lastAlert` keeps the text and
  // colour in place while it collapses, so the alert fades out rather than
  // blanking halfway through the animation.
  const shownAlert = error
    ? { text: error, tone: "error" }
    : message
      ? { text: message, tone: "info" }
      : null;
  const lastAlert = useRef(null);
  if (shownAlert) lastAlert.current = shownAlert;
  const alert = shownAlert || lastAlert.current;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Deliberately NOT clearing `error` here. Blanking it now and setting it
    // again when the request fails collapses and re-expands the alert — two
    // layout shifts in quick succession, which is the "shaking" on retry. A
    // stale error is harmless while the button reads "Signing in...", and it
    // is replaced on failure or navigated away from on success.
    setMessage("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await login({ email, password }, remember);
      const { user } = data;
      if (remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      navigate("/api");
    } catch (err) {
      // Never surface axios's own "Request failed with status code 401" — the
      // backend puts the real reason in `data.error`. See lib/apiError.js.
      setError(getApiErrorMessage(err, "Incorrect email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 sm:p-6 lg:p-8 font-sans">
      <Card className="w-full max-w-md shadow-xl border-gray-100">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-accent-600 rounded-xl shadow-lg shadow-accent-600/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-primary-900">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to the DE Research Platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/*
            Stable alert slot. The card is vertically centred, so a plain
            {error && <div/>} grows it and re-centres everything — the whole
            card visibly jumps. Animating a 0fr -> 1fr grid row expands the
            alert smoothly instead, and living outside the form's space-y-6
            means the collapsed state adds no gap.
          */}
          <div
            className={cn(
              "grid transition-all duration-200 ease-out",
              shownAlert
                ? "grid-rows-[1fr] opacity-100 mb-6"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div
                role="alert"
                aria-live="polite"
                className={cn(
                  "p-4 rounded-xl text-sm border",
                  alert?.tone === "error"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-green-50 text-green-600 border-green-100"
                )}
              >
                {alert?.text}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.edu"
                  className="pl-10 h-11 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary-900"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-600 cursor-pointer"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMessage(
                    "Password reset is not available yet — please contact your administrator."
                  );
                }}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl shadow-lg shadow-accent-600/30 transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/api/register"
              className="text-accent-600 font-bold hover:text-accent-700 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
