"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FiImage } from "react-icons/fi";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    image: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/kiccha-sudeep-2264-17-12-2018-03-28-19.jpg",
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(profile.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200); // Simulate save
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setProfile((p) => ({ ...p, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">My Profile</h1>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-7">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-gray-200 shadow-md">
                <AvatarImage src={imagePreview} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-black text-white rounded-full p-2 shadow-lg opacity-90 hover:opacity-100 focus:outline-none transition-opacity cursor-pointer" 
                onClick={triggerFileInput}
                aria-label="Change profile picture"
              >
                <FiImage className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <span className="text-gray-700 font-bold">Change Profile Photo</span>
          </div>
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
          <Button onClick={handleSaveProfile} disabled={saving} className="w-fit mt-2 bg-black text-white cursor-pointer">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
