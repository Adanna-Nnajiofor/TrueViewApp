"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import type { HostListing } from "@/lib/types";

import imageCompression from "browser-image-compression";

type FileWithPreview = {
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  secureUrl?: string;
  abortController?: AbortController;
};

export default function UploadListing() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<HostListing, "id" | "hostId">>({
    name: "",
    spaceType: "",
    location: "",
    message: "",
    media: [],
  });

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 10;

  // -----------------------------
  // AUTH VALIDATION
  // -----------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/host/login");
      else setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  // -----------------------------
  // FORM INPUT HANDLER
  // -----------------------------
  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // -----------------------------
  // FILE HANDLER
  // -----------------------------
  const handleFiles = async (selectedFiles: FileList) => {
    const arr = Array.from(selectedFiles).slice(0, MAX_FILES - files.length);
    const validFiles: FileWithPreview[] = [];

    for (const file of arr) {
      let processedFile = file;
      const sizeMB = file.size / (1024 * 1024);

      //  1. Handle images: compress if above Cloudinary limit
      if (file.type.startsWith("image/") && sizeMB > MAX_FILE_SIZE_MB) {
        try {
          processedFile = await imageCompression(file, {
            maxSizeMB: MAX_FILE_SIZE_MB - 0.5, // Always keep below 10MB limit
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });

          console.log(
            `${file.name} compressed to ${(
              processedFile.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
        } catch (err) {
          console.error("Image compression error:", err);
          alert(`Failed to compress ${file.name}, skipping this file.`);
          continue;
        }
      }

      //  2. Handle videos: skip if large
      if (file.type.startsWith("video/") && sizeMB > MAX_FILE_SIZE_MB) {
        alert(
          `${file.name} is a video larger than ${MAX_FILE_SIZE_MB}MB and cannot be uploaded on a free Cloudinary plan.`
        );
        continue;
      }

      //  3. Add processed file to preview list
      validFiles.push({
        file: processedFile,
        preview: URL.createObjectURL(processedFile),
        progress: 0,
        status: "pending",
      });
    }

    //  4. Update state
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileInputChange = (e: any) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const removeFile = (index: number) => {
    const fileToRevoke = files[index];
    fileToRevoke.abortController?.abort();
    URL.revokeObjectURL(fileToRevoke.preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------------
  // UPLOAD FILE
  // -----------------------------
  const uploadFile = async (fileObj: FileWithPreview, index: number) => {
    try {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      const formData = new FormData();
      formData.append("file", fileObj.file);
      // optional folder name
      formData.append("folder", "hostSpaces");

      const abortController = new AbortController();
      fileObj.abortController = abortController;

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: abortController.signal,
      });

      const data = await res.json();
      console.log("Upload API response:", data);

      if (!res.ok || !data.secure_urls || data.secure_urls.length === 0) {
        throw new Error(data.error || "Upload failed");
      }

      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "success",
                progress: 100,
                secureUrl: data.secure_urls[0],
              }
            : f
        )
      );
    } catch (err: any) {
      console.error("File upload error:", err);
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "error", progress: 0 } : f
        )
      );
    }
  };

  // -----------------------------
  // UPLOAD ALL FILES
  // -----------------------------
  const uploadAllFiles = async () => {
    const pendingFiles = files.map((f, i) =>
      f.status === "pending" || f.status === "error"
        ? uploadFile(f, i)
        : Promise.resolve()
    );

    await Promise.all(pendingFiles);
  };

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");
    if (files.length === 0) return alert("Upload at least one file.");

    setLoading(true);
    try {
      await uploadAllFiles();

      const uploadedUrls = files
        .filter((f) => f.status === "success" && f.secureUrl)
        .map((f) => f.secureUrl!) as string[];

      if (uploadedUrls.length === 0)
        return alert("No files uploaded successfully.");

      console.log("Final uploaded URLs:", uploadedUrls);

      await addDoc(collection(db, "hostSpaces"), {
        ...formData,
        media: uploadedUrls,
        hostId: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Listing uploaded successfully!");
      setFormData({
        name: "",
        spaceType: "",
        location: "",
        message: "",
        media: [],
      });
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      router.push("/host/dashboard");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Upload failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Upload your space
        </h2>

        {!user ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-xl bg-gray-100"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="spaceType"
                required
                placeholder="Type of Space"
                value={formData.spaceType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
              <input
                type="text"
                name="location"
                required
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <textarea
              name="message"
              rows={4}
              placeholder="About your space..."
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer"
            >
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                Drag & drop files here or click to select (max {MAX_FILES}{" "}
                files)
              </label>
            </div>

            {/* Preview List */}
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {files.map((f, idx) => (
                  <div key={idx} className="relative">
                    {f.file.type.startsWith("image/") ? (
                      <img
                        src={f.preview}
                        alt={f.file.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={f.preview}
                        className="w-full h-24 object-cover rounded"
                      />
                    )}

                    {/* Remove / Retry Buttons */}
                    <div className="absolute top-1 right-1 flex space-x-1">
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                      {f.status === "error" && (
                        <button
                          type="button"
                          onClick={() => uploadFile(f, idx)}
                          className="bg-yellow-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                        >
                          ↻
                        </button>
                      )}
                    </div>

                    {/* Progress bar */}
                    {f.status === "uploading" || f.progress > 0 ? (
                      <div className="w-full bg-gray-200 h-2 rounded mt-1">
                        <div
                          className="bg-black h-2 rounded"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl mt-4"
            >
              {loading ? "Uploading..." : "Submit Listing"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
