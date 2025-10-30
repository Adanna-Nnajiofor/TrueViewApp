"use client";

import { useAuth } from "@/context/AuthProvider";
import { db, storage } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    photoURL: "",
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.data() as any);
        } else {
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: "",
            bio: "",
            photoURL: user.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Unable to fetch profile. Check your internet connection.");
      }
    };
    fetchProfile();
  }, [user]);

  // Handle profile picture upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setSaving(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const fileRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await setDoc(
        doc(db, "users", user.uid),
        { ...profile, photoURL: downloadURL },
        { merge: true }
      );

      setProfile((prev) => ({ ...prev, photoURL: downloadURL }));
      toast.success("Profile photo updated successfully!", { id: toastId });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo.", { id: toastId });
    }

    setSaving(false);
  };

  // Handle saving user profile
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      toast.success("Profile updated successfully!", { id: toastId });
      setEditMode(false);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Error saving profile.", { id: toastId });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center relative"
      >
        {/* Avatar Section */}
        <div className="relative flex justify-center mb-4">
          {profile.photoURL ? (
            <Image
              src={profile.photoURL}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-indigo-600 shadow-md object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-300 text-8xl" />
          )}

          <label className="absolute bottom-1 right-[40%] bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition cursor-pointer">
            <FaCamera size={14} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Content */}
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
              <FaSave />
              {saving ? "Saving..." : "Save Changes"}
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

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </motion.div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-80 text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are you sure you want to log out?
              </h3>
              <div className="flex justify-center gap-3">
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
