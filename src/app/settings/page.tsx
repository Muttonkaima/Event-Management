"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {

  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setTimeout(() => setSavingProfile(false), 1200); // Simulate save
  };

  const handleSavePassword = async () => {
    setSavingPassword(true);
    setTimeout(() => setSavingPassword(false), 1200); // Simulate save
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={profile.name}
              onChange={handleProfileChange}
              className="flex-1"
            />
            <Input
              name="email"
              placeholder="you@email.com"
              value={profile.email}
              onChange={handleProfileChange}
              className="flex-1"
              type="email"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-fit mt-2 bg-black text-white cursor-pointer">
            {savingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <PasswordInput
              name="current"
              placeholder="Current Password"
              value={password.current}
              onChange={handlePasswordChange}
              className="flex-1"
            />
            <PasswordInput
              name="new"
              placeholder="New Password"
              value={password.new}
              onChange={handlePasswordChange}
              className="flex-1"
            />
            <PasswordInput
              name="confirm"
              placeholder="Confirm Password"
              value={password.confirm}
              onChange={handlePasswordChange}
              className="flex-1"
            />
          </div>
          <Button onClick={handleSavePassword} disabled={savingPassword} className="w-fit mt-2 bg-black text-white cursor-pointer">
            {savingPassword ? "Saving..." : "Update Password"}
          </Button>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex items-center gap-3">
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                id="notifications"
              />
              <label htmlFor="notifications" className="text-gray-700 text-sm">
                Enable Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
