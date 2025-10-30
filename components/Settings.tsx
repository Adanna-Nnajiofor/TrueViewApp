"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { motion } from "framer-motion";
import { FaCamera, FaSave } from "react-icons/fa";

export default function SettingsPage() {
  const { user, userData } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || user?.displayName || "");
      setBio(userData.bio || "");
      setPhotoURL(userData.photoURL || user?.photoURL || "");
    }
  }, [userData, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      // 1️⃣ Update Firebase Auth profile
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // 2️⃣ Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName, bio, photoURL });

      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Failed to update profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoURL(imageUrl);
      // 🔵 For production, upload to Firebase Storage and get URL instead of using local object URL
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Account Settings
        </h2>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-indigo-100 object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-5xl">
                ?
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition"
            >
              <FaCamera />
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <p className="text-gray-600 text-sm">
            Click camera icon to change photo
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Bio / About
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us a little about yourself..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          <FaSave />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </section>
  );
}
