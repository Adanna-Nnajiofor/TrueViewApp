"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { HostListing } from "../../../lib/types";

export default function HostDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<HostListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingListing, setEditingListing] = useState<HostListing | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    spaceType: "",
    location: "",
    message: "",
    files: null as FileList | null,
  });

  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>(
    {}
  );

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/host/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // FETCH HOST LISTINGS
  // -----------------------------
  const fetchListings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "hostSpaces"));
      const hostListings: HostListing[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<HostListing, "id">),
        }))
        .filter((l) => l.hostId === user.uid);
      setListings(hostListings);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchListings();
  }, [user]);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/host/login");
  };

  // -----------------------------
  // DELETE LISTING
  // -----------------------------
  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "hostSpaces", id));
      setListings((prev) => prev.filter((l) => l.id !== id));
      alert("Listing deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing.");
    }
  };

  // -----------------------------
  // EDIT LISTING
  // -----------------------------
  const startEditing = (listing: HostListing) => {
    setEditingListing(listing);
    setFormData({
      name: listing.name,
      spaceType: listing.spaceType,
      location: listing.location,
      message: listing.message,
      files: null,
    });
  };

  const uploadFiles = async () => {
    if (!formData.files) return [];

    const urls: string[] = [];
    for (const file of Array.from(formData.files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      urls.push(data.secure_url);
    }

    return urls;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    setLoading(true);
    try {
      let newMedia = editingListing.media || [];
      const uploadedUrls = await uploadFiles();
      if (uploadedUrls.length > 0) newMedia = [...newMedia, ...uploadedUrls];

      await updateDoc(doc(db, "hostSpaces", editingListing.id), {
        name: formData.name,
        spaceType: formData.spaceType,
        location: formData.location,
        message: formData.message,
        media: newMedia,
      });

      alert("Listing updated successfully!");
      setEditingListing(null);
      setFormData({
        name: "",
        spaceType: "",
        location: "",
        message: "",
        files: null,
      });
      fetchListings();
    } catch (err) {
      console.error(err);
      alert("Failed to update listing.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // CAROUSEL NAV
  // -----------------------------
  const nextMedia = (id: string, length: number) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + 1) % length,
    }));
  };

  const prevMedia = (id: string, length: number) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) - 1 + length) % length,
    }));
  };

  // -----------------------------
  // UI
  // -----------------------------
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

      {/* Add/Edit Listing */}
      <section className="bg-white p-6 rounded-2xl shadow-md mb-10">
        {editingListing ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Space Type"
                value={formData.spaceType}
                onChange={(e) =>
                  setFormData({ ...formData, spaceType: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData({ ...formData, files: e.target.files })
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Listing"}
              </button>
            </form>
          </>
        ) : (
          <button
            onClick={() => router.push("/host/upload")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Listing
          </button>
        )}
      </section>

      {/* Listings Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center col-span-full">Loading listings...</p>
        ) : listings.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center text-gray-500">
            No listings yet.
          </div>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Media Carousel */}
              <div className="relative w-full h-48 overflow-hidden">
                {listing.media.length > 0 && (
                  <img
                    src={listing.media[carouselIndex[listing.id] ?? 0]}
                    className="w-full h-full object-cover"
                  />
                )}
                {listing.media.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        prevMedia(listing.id, listing.media.length)
                      }
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        nextMedia(listing.id, listing.media.length)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded-lg"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold">{listing.name}</h3>
                <p className="text-gray-500 text-sm">{listing.spaceType}</p>
                <p className="text-gray-500 text-sm">{listing.location}</p>
                <p className="text-gray-500 text-sm mt-2">{listing.message}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startEditing(listing)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
