"use client";

import { useState } from "react";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
} from "../../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HostSignup() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to save user to Firestore
  const saveUserToFirestore = async (user: User) => {
    try {
      await setDoc(doc(db, "hosts", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        provider: user.providerData[0]?.providerId || "password", // tracks how the user signed up
      });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await saveUserToFirestore(userCredential.user);
      alert("Account created successfully!");
      router.push("/host/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) await saveUserToFirestore(result.user);
      router.push("/host/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      if (result.user) await saveUserToFirestore(result.user);
      router.push("/host/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Host Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl shadow-md hover:bg-gray-800 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          or sign up with
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleGoogleSignup}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Google
          </button>
          <button
            onClick={handleFacebookSignup}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Facebook
          </button>
        </div>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/host/login" className="text-gray-900 font-medium underline">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
