"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { motion } from "framer-motion";

export default function HostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.warn("User doc not found!");
        }
      } else {
        // Optional redirect if not logged in
        router.push("/host/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const isHost = userData?.role === "host";

  return (
    <div className="min-h-screen relative bg-gray-50 text-gray-900">
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
        animate={{ opacity: [0.25, 0.35, 0.25] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <source src="/videos/hero6.mp4" type="video/mp4" />
      </motion.video>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-white/40 to-white/80" />

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">
            {isHost
              ? `Welcome back, ${userData?.displayName || "Host"}!`
              : "Welcome, Host!"}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {isHost
              ? "You can now upload your space and manage your listings."
              : "Log in as a host to manage your listings and start earning."}
          </p>

          {isHost ? (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#111827" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/host/upload")}
              className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition-all"
            >
              Upload a Space
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#4B5563" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/host/login")}
              className="px-8 py-4 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-600 transition-all"
            >
              Host Login
            </motion.button>
          )}
        </motion.div>
      </section>
    </div>
  );
}
