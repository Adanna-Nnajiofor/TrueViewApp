"use client";

import { useAuth } from "@/context/AuthProvider";
import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaCamera,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, loading, setUserData, userData } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    photoURL: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Initialize profile from context
  useEffect(() => {
    if (userData) {
      setProfile(userData as any);
      setPreviewPhoto(userData.photoURL || null);
    }
  }, [userData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const previewURL = URL.createObjectURL(file);
    setPreviewPhoto(previewURL);

    setSaving(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      // Convert to base64
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

      const base64Data = await toBase64(file);

      // Upload via API route
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: base64Data, folder: "users" }),
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      // Update Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { ...profile, photoURL: data.url },
        { merge: true }
      );

      // Update context
      setUserData({ ...profile, photoURL: data.url });
      setProfile((prev) => ({ ...prev, photoURL: data.url }));

      toast.success("Profile photo updated!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload failed: ${err.message}`, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });

      // Update context immediately
      setUserData(profile);

      toast.success("Profile updated successfully!", { id: toastId });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );
  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center relative"
      >
        {/* Avatar */}
        <div className="relative flex justify-center mb-4">
          {previewPhoto ? (
            <Image
              src={previewPhoto}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-indigo-600 shadow-md object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-300 text-8xl" />
          )}
          <label className="absolute bottom-1 right-[40%] bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition cursor-pointer">
            <FaCamera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={saving}
            />
          </label>
        </div>

        {/* Profile Info */}
        {editMode ? (
          <>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="Full Name"
              className="border border-gray-300 w-full p-2 rounded-lg mb-3"
            />
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="border border-gray-300 w-full p-2 rounded-lg mb-3"
            />
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Write a short bio..."
              className="border border-gray-300 w-full p-2 rounded-lg mb-3"
              rows={3}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex justify-center items-center gap-2 transition"
            >
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900">
              {profile.displayName || "No name provided"}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
              <FaEnvelope className="text-indigo-500" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
              <FaPhone className="text-indigo-500" />
              <span>{profile.phone || "No phone added"}</span>
            </div>
            <p className="text-gray-700 italic mt-3">
              {profile.bio || "No bio yet. Add one!"}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
            >
              <FaEdit /> Edit Profile
            </button>
          </>
        )}

        <hr className="my-6 border-gray-200" />

        <button
          onClick={() => logout().then(() => router.push("/login"))}
          className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </motion.div>
    </div>
  );
}
