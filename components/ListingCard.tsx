"use client";

import Link from "next/link";
import { useState } from "react";
import { Listing } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaVideo, FaTag, FaLock, FaStar } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";

interface Props {
  listing: Listing;
}

const ListingCard = ({ listing }: Props) => {
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);

  const handleGuestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        <Link
          href={user ? `/listings/${listing.slug}` : "#"}
          onClick={!user ? handleGuestClick : undefined}
        >
          {/* Thumbnail Section */}
          <div className="relative h-56 sm:h-64 md:h-52 lg:h-56 overflow-hidden">
            <img
              src={listing.thumbnail}
              alt={listing.title}
              className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${
                !user ? "blur-sm brightness-90" : ""
              }`}
            />

            {/* Category Tag */}
            <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <FaTag className="inline-block mr-1" />
              {listing.category}
            </span>

            {/* ⭐ Featured Tag */}
            {listing.featured && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <FaStar className="text-white" />
                Featured
              </span>
            )}

            {/* Overlay Action */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              {user ? (
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-indigo-600 text-sm px-4 py-2 rounded-full shadow-md font-medium hover:bg-indigo-50">
                  <FaVideo className="text-indigo-500" />
                  <span>View Tour</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-red-600 text-sm px-4 py-2 rounded-full shadow-md font-medium hover:bg-red-50">
                  <FaLock className="text-red-500" />
                  <span>Login to Unlock</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-5">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
              {listing.title}
            </h3>

            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <FaMapMarkerAlt className="text-indigo-500" />
              <span>{listing.location}</span>
            </div>

            <p className="text-indigo-700 font-semibold mt-3 text-base">
              {listing.price}
            </p>

            <div className="mt-3">
              {user ? (
                <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                  Learn More →
                </button>
              ) : (
                <button
                  onClick={handleGuestClick}
                  className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  Login to See More →
                </button>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Want to Explore More?
              </h3>
              <p className="text-gray-600 mb-6">
                Log in or create an account to unlock full 3D tours, exclusive
                pricing, and detailed property insights.
              </p>

              <div className="flex justify-center gap-3">
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-full font-medium hover:bg-indigo-50 transition"
                >
                  Sign Up
                </Link>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ListingCard;
