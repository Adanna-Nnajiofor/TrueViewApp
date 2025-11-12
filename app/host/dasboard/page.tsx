"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function HostDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/host/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/host/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Host Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-md">
        {user ? (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Welcome, {user.email}
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your listings, add new spaces, and track performance here.
            </p>

            <button
              onClick={() => router.push("/host/upload")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              + Add New Listing
            </button>

            {/* listings grid placeholder */}
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-48 text-gray-500">
                No listings yet.
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </section>
    </div>
  );
}
