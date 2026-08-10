import React, { useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";
import { useSimulation } from "../context/SimulationContext";
import { authService, uploadToS3 } from "../services/api";
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
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Users
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
import { cn } from "../lib/utils";

const MIN_UPLOAD_DURATION_MS = 800;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resolves once the promise settles AND at least minMs have elapsed.
const withMinDuration = async (promise, minMs) => {
  const delay = wait(minMs);
  try {
    return await promise;
  } finally {
    await delay;
  }
};

const Portfolio = () => {
  const { user, updateUser } = useAuth();
  const { simulations = [] } = useSimulation();
  
  const simulationCount = user?.simulationCount || simulations.length || 42; 

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState({
    username: user?.name || user?.username || "Researcher",
    email: user?.email || "researcher@example.com",
    affiliation: user?.affiliation || "",
    profilePicture: null
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    // Reset the input so selecting the same file again still fires onChange
    e.target.value = "";
    if (!file) return;

    setAvatarSuccess("");
    setAvatarError("");

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setAvatarError("Please choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be 5 MB or smaller.");
      return;
    }

    setAvatarUploading(true);
    try {
      await withMinDuration(
        (async () => {
          const { data } = await authService.getPresignedUrl(file.type);
          const versionId = await uploadToS3(data.uploadUrl, file);
          const confirmRes = await authService.confirmProfilePicture(versionId);
          updateUser({ profilePicture: confirmRes.data.user.profilePicture });
        })(),
        MIN_UPLOAD_DURATION_MS
      );
      setAvatarSuccess("Profile picture updated successfully!");
      setTimeout(() => setAvatarSuccess(""), 3000);
    } catch (err) {
      setAvatarError(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    setSaveSuccess("");
    setSaveError("");

    try {
      // Backend PATCH /user/profile expects `username` (NOT `name`) and has no
      // password field — password changes go through /user/password only.
      const updateData = {
        username: formData.username,
        email: formData.email,
        affiliation: formData.affiliation,
      };
      await authService.updateProfile(updateData);
      // Propagate the new values app-wide (sidebar, header) immediately.
      updateUser({
        username: formData.username,
        name: formData.username,
        email: formData.email,
        affiliation: formData.affiliation,
      });
      setSaveSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-xl shadow-accent-600/20 ring-4 ring-white"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-accent-600/20 ring-4 ring-white">
                  {formData.username[0].toUpperCase()}
                </div>
              )}
              <label
                htmlFor="portfolio-avatar-input"
                title="Change profile photo"
                className={`absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:text-accent-600 transition-colors group-hover:scale-110 duration-200 cursor-pointer ${
                  avatarUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <Camera className="w-5 h-5" />
              </label>
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

        {/* Success/Error Alerts */}
        {saveSuccess && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {saveSuccess}
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {saveError}
          </div>
        )}

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
                    <div className="h-12 flex items-center px-4 bg-gray-50/50 border border-transparent rounded-xl text-gray-500 text-sm">
                      Change your password in Account Settings.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 px-1">
                      <Users className="w-4 h-4 text-gray-400" /> Affiliation / Organization
                    </label>
                    <Input 
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="University of Science"
                      className={cn(
                        "h-12 rounded-xl border-gray-200 focus:ring-accent-600 transition-all",
                        !isEditing && "bg-gray-50/50 border-transparent text-gray-600 font-medium"
                      )}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-center p-6 bg-accent-50/50 rounded-3xl border border-accent-100">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="font-bold text-accent-900">Profile Picture</h4>
                      <p className="text-sm text-accent-700/70 font-medium">PNG, JPG or GIF. Max 5MB.</p>
                      {avatarSuccess && (
                        <p className="text-sm text-green-600 font-semibold flex items-center gap-1 justify-center md:justify-start">
                          <CheckCircle2 className="w-4 h-4" /> {avatarSuccess}
                        </p>
                      )}
                      {avatarError && (
                        <p className="text-sm text-red-600 font-semibold flex items-center gap-1 justify-center md:justify-start">
                          <AlertCircle className="w-4 h-4" /> {avatarError}
                        </p>
                      )}
                    </div>
                    <label
                      htmlFor="portfolio-avatar-input"
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-accent-200 text-accent-700 bg-white hover:bg-accent-50 transition-colors h-11 px-6 cursor-pointer font-medium text-sm ${
                        avatarUploading ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      {avatarUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>Update Avatar</>
                      )}
                    </label>
                    <input
                      id="portfolio-avatar-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
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

        {/* Supervisor Acknowledgment & Project Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-accent-600 to-accent-400" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent-600" />
                Supervisor Acknowledgment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent-50 rounded-2xl border border-accent-100">
                <p className="text-sm text-accent-700 font-medium mb-2">This project was conducted under the supervision of:</p>
                <p className="text-xl font-bold text-primary-900">Dr. [Supervisor Name]</p>
                <p className="text-sm text-gray-500 mt-1">Department of [Department Name]</p>
                <p className="text-sm text-gray-500">[University/Organization Name]</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Special thanks to our supervisor for their invaluable guidance, mentorship, and support throughout the development of this Differential Evolution research platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-900 to-accent-600" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-900" />
                About This Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                The DE Research Dashboard is a comprehensive web platform designed for researchers studying Differential Evolution algorithms. It enables comparison of 80 algorithm variants across multiple benchmark functions.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-900">10</p>
                  <p className="text-xs text-gray-500 font-medium">Mutation Schemes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-900">4</p>
                  <p className="text-xs text-gray-500 font-medium">Crossover Methods</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-900">2</p>
                  <p className="text-xs text-gray-500 font-medium">Selection Methods</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-900">10</p>
                  <p className="text-xs text-gray-500 font-medium">Benchmark Functions</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {["React", "Tailwind CSS", "Chart.js", "Node.js", "Express"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-primary-900 text-white text-xs font-bold rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;
