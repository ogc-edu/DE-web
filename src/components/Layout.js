import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  Database,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active
        ? "bg-accent-600 text-white shadow-lg shadow-accent-600/20"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon
      className={cn(
        "w-5 h-5 shrink-0",
        active ? "text-white" : "group-hover:scale-110 transition-transform"
      )}
    />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
    {active && !collapsed && <ChevronRight className="w-4 h-4 ml-auto" />}
  </Link>
);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/api" },
    { icon: PlayCircle, label: "Simulator", href: "/api/simulator" },
    { icon: Database, label: "Simulation History", href: "/api/data" },
    { icon: User, label: "Portfolio", href: "/api/portfolio" },
    { icon: Settings, label: "Account Settings", href: "/api/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans">
      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-primary-900 text-white transition-all duration-300 ease-in-out fixed h-full z-30 shadow-2xl",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
                DE
              </div>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                Research Hub
              </span>
            </div>
          )}
          {!isSidebarOpen && (
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center font-bold text-white mx-auto">
              D
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={location.pathname === item.href}
              collapsed={!isSidebarOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          {user && isSidebarOpen && (
            <div className="px-4 py-3 bg-white/5 rounded-xl mb-4 flex items-center gap-3">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name[0]}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 px-4 py-6 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && (
              <span className="font-medium text-sm">Sign Out</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary-900 text-white p-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center font-bold text-white">
            D
          </div>
          <span className="font-bold">Research Hub</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-primary-900 z-30 pt-20 px-6 animate-in slide-in-from-top duration-300">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl text-lg font-medium",
                  location.pathname === item.href
                    ? "bg-accent-600 text-white"
                    : "text-gray-400"
                )}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-4 p-4 text-lg font-medium text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out pt-20 md:pt-0",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
