"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSignInAlt, FaGoogle, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithOAuth, userData, refreshUserData } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "host">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      await refreshUserData();

      if (!userData) {
        setError("You must register before logging in.");
        return;
      }

      router.push(role === "host" ? "/host/dashboard" : "/listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setError("");
    setLoading(true);

    try {
      await loginWithOAuth(provider, role);
      await refreshUserData();
      router.push(role === "host" ? "/host/dashboard" : "/listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-2">
          <FaSignInAlt /> Login
        </h2>

        {/* Role Selection */}
        <div className="mb-4 flex justify-center gap-4">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-lg ${
              role === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("host")}
            className={`px-4 py-2 rounded-lg ${
              role === "host" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Host
          </button>
        </div>

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
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" /> Sign in with Google
          </button>

          <button
            onClick={() => handleOAuthLogin("facebook")}
            disabled={loading}
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
