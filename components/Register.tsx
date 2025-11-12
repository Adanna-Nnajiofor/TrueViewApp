"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserPlus, FaGoogle, FaFacebook } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { signupWithEmail, signupWithOAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"user" | "host">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signupWithEmail(email, password, displayName, role);
      router.push(role === "host" ? "/host/dashboard" : "/listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: "google" | "facebook") => {
    setError("");
    setLoading(true);
    try {
      await signupWithOAuth(provider, role);
      router.push(role === "host" ? "/host/dashboard" : "/listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <FaUserPlus /> Register
        </h2>

        {/* Role Selection */}
        <div className="mb-4 flex justify-center gap-4">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-lg ${
              role === "user" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("host")}
            className={`px-4 py-2 rounded-lg ${
              role === "host" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Host
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* OAuth Signups */}
        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => handleOAuthSignup("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" /> Sign up with Google
          </button>

          <button
            onClick={() => handleOAuthSignup("facebook")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaFacebook className="text-blue-600" /> Sign up with Facebook
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            href={role === "host" ? "/host/login" : "/login"}
            className="text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
