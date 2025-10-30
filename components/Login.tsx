"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSignInAlt, FaGoogle, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-2">
          <FaSignInAlt /> Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" /> Sign in with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaFacebook className="text-blue-600" /> Sign in with Facebook
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
