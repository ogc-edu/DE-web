import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleRemember = () => {
    setRemember(!remember);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await login({ email, password }, remember);
      const { user } = data;
      // token is stored by AuthContext.login before fetching the profile
      if (remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      setMessage("Login successful!");
      setTimeout(() => navigate("/api"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password");
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm border border-destructive/20 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100">
                {message}
              </div>
            )}

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
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-600 cursor-pointer"
                  checked={remember}
                  onChange={handleRemember}
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
            Don't have an account?{" "}
            <Link
              to="/api/register"
              className="text-accent-600 font-bold hover:text-accent-700 transition-colors"
            >
              Join our research community
            </Link>
          </p>
          <Link
            to="/api"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Dashboard</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
