"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function HostListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/host/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // FETCH HOST LISTINGS
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "hostSpaces"),
      where("hostId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setListings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // -----------------------------
  // DELETE LISTING
  // -----------------------------
  const deleteListing = async (listing: any) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this listing? This action is permanent."
    );
    if (!confirmDelete) return;

    try {
      // Only delete Firestore document, media is on Cloudinary
      await deleteDoc(doc(db, "hostSpaces", listing.id));
      alert("Listing deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing.");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Listings</h1>

        <button
          onClick={() => router.push("/host/upload")}
          className="mb-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          + Add New Listing
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500 mt-6">You have no listings yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                {item.media?.[0] && (
                  <img
                    src={item.media[0]}
                    className="w-full h-40 object-cover"
                    alt=""
                  />
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.spaceType}</h3>
                  <p className="text-sm text-gray-500">{item.location}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        router.push(`/host/listings/${item.id}/edit`)
                      }
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteListing(item)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
