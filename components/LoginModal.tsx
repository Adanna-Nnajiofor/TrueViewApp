"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-indigo-800/20 via-transparent to-black/60"
      />

      {/* Main Modal */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl mx-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/trueview-logo.png" // replace with your actual logo path
            alt="TrueView Logo"
            width={70}
            height={70}
            className="rounded-full shadow-md"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Unlock the TrueView Experience
        </h2>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Step inside premium real estate, tourism, and creative worlds. Sign in
          to explore 360° virtual tours and exclusive content.
        </p>

        {/* Login Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-2 rounded-xl hover:bg-gray-100 transition">
            <FcGoogle size={22} /> Continue with Google
          </button>

          <button className="flex items-center justify-center gap-3 bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition">
            <FaFacebook size={20} /> Continue with Facebook
          </button>

          <Link
            href="/login"
            className="bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Sign In with Email
          </Link>

          <Link
            href="/register"
            className="bg-white/20 border border-indigo-400 text-indigo-200 py-2 rounded-xl font-semibold hover:bg-indigo-500 hover:text-white transition"
          >
            Create Account
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <div className="h-px bg-white/20 w-1/3" />
          <span className="text-xs text-gray-400 px-3 uppercase tracking-widest">
            or
          </span>
          <div className="h-px bg-white/20 w-1/3" />
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-400 italic">
          TrueView — Experience Beyond Walls.
        </p>
      </motion.div>
    </div>
  );
}
