"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db, storage } from "../../../../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function EditListingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const listingId = pathname.split("/").pop();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    spaceType: "",
    location: "",
    message: "",
    media: [] as string[],
  });

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
  // FETCH EXISTING LISTING
  // -----------------------------
  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      const docRef = doc(db, "hostSpaces", listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData({
          ...(docSnap.data() as any),
          media: (docSnap.data() as any).media || [],
        });
        setLoading(false);
      } else {
        alert("Listing not found.");
        router.push("/host/listings");
      }
    };

    fetchListing();
  }, [listingId, router]);

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const removeMedia = async (url: string) => {
    const confirmDelete = confirm("Remove this media from listing?");
    if (!confirmDelete) return;

    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      setFormData({
        ...formData,
        media: formData.media.filter((m) => m !== url),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove media.");
    }
  };

  const uploadNewFiles = async () => {
    if (!files || files.length === 0) return [];

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fileRef = ref(
        storage,
        `host-spaces/${user.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const newUrls = await uploadNewFiles();

      const docRef = doc(db, "hostSpaces", listingId!);
      await updateDoc(docRef, {
        ...formData,
        media: [...formData.media, ...newUrls],
        updatedAt: serverTimestamp(),
      });

      alert("Listing updated successfully!");
      router.push("/host/listings");
    } catch (err) {
      console.error(err);
      alert("Failed to update listing.");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Listing</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Space Type + Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Type of Space
              </label>
              <input
                type="text"
                name="spaceType"
                value={formData.spaceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
            />
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Existing Media
            </label>
            <div className="flex gap-3 flex-wrap">
              {formData.media.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Media */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Photos or Videos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.03 }}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-500 transition"
          >
            {submitting ? "Updating..." : "Update Listing"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
