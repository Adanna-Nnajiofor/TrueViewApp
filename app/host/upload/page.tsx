"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { auth, db, storage } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import type { HostListing } from "@/lib/types";

export default function UploadListing() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize formData using HostListing (excluding hostId & id)
  const [formData, setFormData] = useState<Omit<HostListing, "id" | "hostId">>({
    name: "",
    spaceType: "",
    location: "",
    message: "",
    media: [],
  });

  // Initialize FFmpeg
  const ffmpeg = new FFmpeg();

  // -----------------------------
  // AUTH VALIDATION
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/host/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // FORM HANDLERS
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  // -----------------------------
  // COMPRESS VIDEO
  // -----------------------------
  const compressVideo = async (file: File): Promise<File> => {
    if (!ffmpeg.loaded) await ffmpeg.load();

    await ffmpeg.writeFile(file.name, await fetchFile(file));

    await ffmpeg.exec([
      "-i",
      file.name,
      "-vcodec",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "fast",
      "-movflags",
      "+faststart",
      `compressed-${file.name}`,
    ]);

    const data = await ffmpeg.readFile(`compressed-${file.name}`);

    if (typeof data === "string") {
      // Rare case: FFmpeg returned a string, convert to Uint8Array
      const bytes = new TextEncoder().encode(data);
      return new File([bytes], file.name, { type: "video/mp4" });
    } else {
      // Normal case: Uint8Array
      const bytes = new Uint8Array(data); // ensure standard Uint8Array
      return new File([bytes], file.name, { type: "video/mp4" });
    }
  };

  // -----------------------------
  // UPLOAD FILE WITH PROGRESS
  // -----------------------------
  const uploadFileWithProgress = (
    file: File,
    index: number,
    totalFiles: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(
        storage,
        `host-spaces/${user?.uid}/${Date.now()}-${file.name}`
      );

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes / totalFiles) *
            100;
          setProgress((prev) => Math.min(prev + percent, 100));
        },
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  // -----------------------------
  // HANDLE ALL FILES
  // -----------------------------
  const processFiles = async (): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const totalFiles = files.length;

    const preparedFiles: File[] = await Promise.all(
      Array.from(files).map(async (file) =>
        file.type.startsWith("video/") ? compressVideo(file) : file
      )
    );

    const uploadedUrls: string[] = await Promise.all(
      preparedFiles.map((file, idx) =>
        uploadFileWithProgress(file, idx, totalFiles)
      )
    );

    return uploadedUrls;
  };

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");
    if (!files || files.length === 0) return alert("Upload at least one file.");

    setLoading(true);
    setProgress(0);

    try {
      const uploadedUrls = await processFiles();

      const listing: HostListing = {
        ...formData,
        media: uploadedUrls,
        hostId: user.uid,
        id: "", // Firestore will generate this
      };

      await addDoc(collection(db, "hostSpaces"), {
        ...listing,
        createdAt: serverTimestamp(),
      });

      alert("Your listing has been uploaded successfully!");
      setFormData({
        name: "",
        spaceType: "",
        location: "",
        message: "",
        media: [],
      });
      setFiles(null);
      setProgress(0);
      router.push("/host/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to upload listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Upload Your Space
        </h2>

        {!user ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

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
                  placeholder="Apartment, Hall, Studio..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your space..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Photos or Videos
              </label>
              <input
                type="file"
                accept="image/*, video/*"
                multiple
                onChange={handleFileChange}
              />
            </div>

            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-gray-900 h-4 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-xl shadow-md hover:bg-gray-800 transition"
            >
              {loading
                ? `Uploading ${Math.round(progress)}%`
                : "Submit Listing"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
