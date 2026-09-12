import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// Standalone (no Layout) so an unknown URL renders the same whether or not the
// visitor is signed in — the authenticated shell needs a user and would blank
// out for logged-out visitors.
function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 sm:p-6 lg:p-8 font-sans">
      <Card className="w-full max-w-md shadow-xl border-gray-100">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-accent-600 rounded-xl shadow-lg shadow-accent-600/20">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-primary-900">
              Page not found
            </CardTitle>
            <CardDescription>
              There is nothing at this address.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600 text-center break-all">
            <code className="px-2 py-1 bg-gray-50 rounded-md text-gray-700">
              {location.pathname}
            </code>
          </p>
          <Button
            asChild
            className="w-full h-11 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl shadow-lg shadow-accent-600/30 transition-all transform active:scale-[0.98]"
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

export default NotFound;
