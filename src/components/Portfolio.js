import React, { useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";
import { useSimulation } from "../context/SimulationContext";
import { 
  User, 
  Mail, 
  Lock, 
  Activity, 
  Camera, 
  Save, 
  Edit2,
  Settings,
  Shield,
  CreditCard,
  Bell,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { cn } from "../lib/utils";

const Portfolio = () => {
  const { user } = useAuth();
  const { simulations = [] } = useSimulation(); // Assuming simulations might be available or mock it
  
  // Mock simulation count if not available from context
  const simulationCount = user?.simulationCount || 42; 

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.name || "Researcher",
    email: user?.email || "researcher@example.com",
    password: "••••••••",
    profilePicture: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you'd call an API here
    setIsEditing(false);
    console.log("Saving profile data:", formData);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-accent-600/20 ring-4 ring-white">
                {formData.username[0].toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:text-accent-600 transition-colors group-hover:scale-110 duration-200">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">
                {formData.username}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4" /> {formData.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Premium Researcher
                </span>
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-primary-900 hover:bg-primary-800 text-white gap-2 rounded-xl px-6 h-12 transition-all hover:shadow-lg active:scale-95"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl h-12 px-6 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-accent-600 hover:bg-accent-700 text-white gap-2 rounded-xl px-6 h-12 transition-all hover:shadow-lg active:scale-95"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
              <div className="h-2 bg-accent-600" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent-600" /> Activity Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Total Simulations</p>
                    <p className="text-2xl font-bold text-primary-900">{simulationCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-600 group-hover:bg-accent-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 border border-gray-100 rounded-2xl">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Rank</p>
                    <p className="text-lg font-bold text-primary-900">#12</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-2xl">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Impact</p>
                    <p className="text-lg font-bold text-primary-900">High</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Navigation</p>
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-2 space-y-1 border border-gray-100">
                {[
                  { icon: User, label: "Personal Information", active: true },
                  { icon: Shield, label: "Security & Privacy", active: false },
                  { icon: Bell, label: "Notification Settings", active: false },
                  { icon: CreditCard, label: "Subscription Plan", active: false },
                  { icon: Settings, label: "Preferences", active: false },
                ].map((item, i) => (
                  <button 
                    key={i}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm",
                      item.active 
                        ? "bg-accent-50 text-accent-700 shadow-sm" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary-900"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-gray-50 bg-white/50 backdrop-blur-sm px-8 py-6">
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription>View and manage your researcher profile details</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 px-1">
                      <User className="w-4 h-4 text-gray-400" /> Username
                    </label>
                    <Input 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={cn(
                        "h-12 rounded-xl border-gray-200 focus:ring-accent-600 transition-all",
                        !isEditing && "bg-gray-50/50 border-transparent text-gray-600 font-medium"
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 px-1">
                      <Mail className="w-4 h-4 text-gray-400" /> Email Address
                    </label>
                    <Input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={cn(
                        "h-12 rounded-xl border-gray-200 focus:ring-accent-600 transition-all",
                        !isEditing && "bg-gray-50/50 border-transparent text-gray-600 font-medium"
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 px-1">
                      <Lock className="w-4 h-4 text-gray-400" /> Password
                    </label>
                    <div className="relative">
                      <Input 
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={cn(
                          "h-12 rounded-xl border-gray-200 focus:ring-accent-600 transition-all pr-12",
                          !isEditing && "bg-gray-50/50 border-transparent text-gray-600 font-medium tracking-widest"
                        )}
                      />
                      {isEditing && (
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 px-1">
                      <Activity className="w-4 h-4 text-gray-400" /> Simulation Count
                    </label>
                    <div className="h-12 flex items-center px-4 bg-gray-50/50 border border-transparent rounded-xl text-gray-600 font-bold">
                      {simulationCount} simulations completed
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-center p-6 bg-accent-50/50 rounded-3xl border border-accent-100">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="font-bold text-accent-900">Profile Picture</h4>
                      <p className="text-sm text-accent-700/70 font-medium">PNG, JPG or GIF. Max 5MB.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-accent-200 text-accent-700 bg-white hover:bg-accent-50 transition-colors h-11 px-6">
                      Update Avatar
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 px-8 py-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Your data is encrypted and secure
                </p>
                <p className="text-xs text-gray-400 font-medium italic">Last updated: April 13, 2026</p>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl p-6 bg-primary-900 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent-600/30 transition-all duration-700" />
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Security Checkup</h3>
                    <p className="text-primary-200 text-sm mt-1">2-Factor Authentication is currently disabled.</p>
                  </div>
                  <Button className="w-full bg-white text-primary-900 hover:bg-accent-50 font-bold rounded-xl h-11 shadow-lg shadow-black/20">
                    Enable 2FA
                  </Button>
                </div>
              </Card>

              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl p-6 bg-white overflow-hidden relative group">
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary-900 leading-tight">Notifications</h3>
                    <p className="text-gray-500 text-sm mt-1">You have 3 new simulation results to review.</p>
                  </div>
                  <Button variant="outline" className="w-full border-gray-200 text-primary-900 hover:bg-gray-50 font-bold rounded-xl h-11">
                    View Alerts
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;
