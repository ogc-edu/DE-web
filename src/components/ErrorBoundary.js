import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, LayoutDashboard, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// App-level render-error fallback. Must be a class component — there is no hook
// equivalent of componentDidCatch. Pass `resetKey` (the current pathname, see
// App.js) so navigating away from a broken route clears the error instead of
// pinning the fallback for the rest of the session.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught render error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  handleRetry() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 sm:p-6 lg:p-8 font-sans">
        <Card className="w-full max-w-md shadow-xl border-gray-100">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-destructive rounded-xl shadow-lg shadow-destructive/20">
              <AlertTriangle className="w-8 h-8 text-destructive-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-primary-900">
                Something went wrong
              </CardTitle>
              <CardDescription>
                This page failed to render. Your data has not been changed.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error.message && (
              <p className="text-sm text-gray-600 text-center break-words">
                <code className="px-2 py-1 bg-gray-50 rounded-md text-gray-700">
                  {error.message}
                </code>
              </p>
            )}
            <Button
              onClick={this.handleRetry}
              className="w-full h-11 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl shadow-lg shadow-accent-600/30 transition-all transform active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              Try again
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-xl font-bold"
            >
              <Link to="/api">
                <LayoutDashboard className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ErrorBoundary;
