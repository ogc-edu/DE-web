import React, { useRef, useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";
import { authService, uploadToS3 } from "../services/api";
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  ImagePlus,
  Camera,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

const MIN_SAVE_DURATION_MS = 800;

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resolves once the promise settles AND at least minMs have elapsed.
// Ensures the loading state is visible for a minimum duration even on fast/error responses.
const withMinDuration = async (promise, minMs) => {
  const delay = wait(minMs);
  try {
    return await promise;
  } finally {
    await delay;
  }
};

const AccountSettings = () => {
  const { user, logout, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    affiliation: user?.affiliation || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const profileSuccessTimer = useRef(null);
  const passwordSuccessTimer = useRef(null);
  const avatarSuccessTimer = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    // Reset the input so selecting the same file again still fires onChange
    e.target.value = "";
    if (!file) return;

    setAvatarSuccess("");
    setAvatarError("");

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Please choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError("Image must be 5 MB or smaller.");
      return;
    }

    if (avatarSuccessTimer.current) {
      clearTimeout(avatarSuccessTimer.current);
      avatarSuccessTimer.current = null;
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
        MIN_SAVE_DURATION_MS
      );
      setAvatarSuccess("Profile photo updated successfully!");
      avatarSuccessTimer.current = setTimeout(() => {
        setAvatarSuccess("");
        avatarSuccessTimer.current = null;
      }, 3000);
    } catch (err) {
      setAvatarError(err.response?.data?.message || "Failed to upload profile photo.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSave = async () => {
    // Disable button + show spinner immediately
    setProfileSaving(true);
    // Clear previous success timer so a stale timeout can't wipe the new message
    if (profileSuccessTimer.current) {
      clearTimeout(profileSuccessTimer.current);
      profileSuccessTimer.current = null;
    }
    setProfileSuccess("");
    setProfileError("");

    try {
      const payload = { affiliation: profileData.affiliation };
      // Only send required fields when non-empty; empty username/email fail backend Zod validation
      if (profileData.name) payload.username = profileData.name;
      if (profileData.email) payload.email = profileData.email;
      await withMinDuration(authService.updateProfile(payload), MIN_SAVE_DURATION_MS);
      setProfileSuccess("Profile updated successfully!");
      profileSuccessTimer.current = setTimeout(() => {
        setProfileSuccess("");
        profileSuccessTimer.current = null;
      }, 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    // Disable button + show spinner immediately
    setPasswordSaving(true);

    try {
      await withMinDuration(
        authService.changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        MIN_SAVE_DURATION_MS
      );
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      if (passwordSuccessTimer.current) {
        clearTimeout(passwordSuccessTimer.current);
      }
      passwordSuccessTimer.current = setTimeout(() => {
        setPasswordSuccess("");
        passwordSuccessTimer.current = null;
      }, 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information and security preferences
          </p>
        </div>

        {/* Profile Photo */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-accent-600" />
              Profile Photo
            </CardTitle>
            <CardDescription>Upload a photo to personalize your account</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <label
              htmlFor="avatar-upload-input"
              title="Change profile photo"
              className={`relative shrink-0 group rounded-full cursor-pointer ${
                avatarUploading ? "pointer-events-none opacity-80" : ""
              }`}
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-accent-600/20 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent-600 flex items-center justify-center text-2xl font-bold text-white group-hover:opacity-80 transition-opacity">
                  {user?.name?.[0] || user?.username?.[0] || "U"}
                </div>
              )}
              {!avatarUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </label>

            <div className="space-y-2">
              <label
                htmlFor="avatar-upload-input"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors cursor-pointer ${
                  avatarUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {avatarUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Change Photo
                  </>
                )}
              </label>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF up to 5 MB.
              </p>

              {/* Fixed-height status slot: keeps the layout stable while uploading/success/error swap */}
              <div className="h-6 flex items-center text-sm">
                {!avatarUploading && avatarSuccess && (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    {avatarSuccess}
                  </span>
                )}
                {!avatarUploading && avatarError && (
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {avatarError}
                  </span>
                )}
              </div>
            </div>

            <input
              id="avatar-upload-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent-600" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="pl-10 h-11 rounded-xl bg-neutral-50 border-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="pl-10 h-11 rounded-xl bg-neutral-50 border-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliation">Affiliation / Organization</Label>
              <Input
                id="affiliation"
                name="affiliation"
                value={profileData.affiliation}
                onChange={(e) => setProfileData({ ...profileData, affiliation: e.target.value })}
                placeholder="University of Science"
                className="h-11 rounded-xl bg-neutral-50 border-none"
              />
            </div>

            {/* Fixed-height status slot: keeps the layout stable while saving/success/error swap */}
            <div className="h-6 flex items-center text-sm">
              {!profileSaving && profileSuccess && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {profileSuccess}
                </span>
              )}
              {!profileSaving && profileError && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {profileError}
                </span>
              )}
            </div>

            <Button
              onClick={handleProfileSave}
              disabled={profileSaving}
              className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent-600" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pl-10 pr-10 h-11 rounded-xl bg-neutral-50 border-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pl-10 pr-10 h-11 rounded-xl bg-neutral-50 border-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pl-10 h-11 rounded-xl bg-neutral-50 border-none"
                />
              </div>
            </div>

            {/* Fixed-height status slot: keeps the layout stable while saving/success/error swap */}
            <div className="h-6 flex items-center text-sm">
              {!passwordSaving && passwordSuccess && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {passwordSuccess}
                </span>
              )}
              {!passwordSaving && passwordError && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </span>
              )}
            </div>

            <Button
              onClick={handlePasswordSave}
              disabled={passwordSaving}
              className="bg-accent-600 hover:bg-accent-700 text-white rounded-xl"
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-none shadow-sm border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              onClick={() => {
                if (window.confirm("Are you sure you want to sign out?")) {
                  logout();
                }
              }}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AccountSettings;
