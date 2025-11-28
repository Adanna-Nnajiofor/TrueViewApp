"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTag,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
import { Listing } from "@/lib/types";

interface Props {
  featured: Listing[];
}

const FeaturedListings = ({ featured = [] }: Props) => {
  const [current, setCurrent] = useState(0);

  //  Guard against empty or undefined featured list
  const hasFeatured = featured && featured.length > 0;

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!hasFeatured) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length, hasFeatured]);

  const nextSlide = () => {
    if (!hasFeatured) return;
    setCurrent((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    if (!hasFeatured) return;
    setCurrent((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  if (!hasFeatured) {
    return (
      <section className="py-12 bg-gradient-to-b from-indigo-50 to-white text-center text-gray-500">
        <p>No featured listings available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full py-12 bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          🌟 Featured Listings
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured[current].slug}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src={featured[current]?.thumbnail}
                alt={featured[current]?.title || "Featured listing"}
                className="w-full h-[350px] md:h-[420px] object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-10 text-left">
                <span className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3 w-fit">
                  <FaTag />
                  {featured[current]?.category}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-semibold mb-2">
                  {featured[current]?.title}
                </h3>
                <p className="text-gray-200 text-sm flex items-center gap-1 mb-3">
                  <FaMapMarkerAlt className="text-indigo-400" />
                  {featured[current]?.location}
                </p>
                <p className="text-indigo-300 font-bold text-lg mb-4">
                  {featured[current]?.price}
                </p>

                <Link
                  href={`/listings/${featured[current]?.slug}`}
                  className="bg-white text-indigo-700 font-medium px-6 py-2 rounded-full hover:bg-indigo-50 transition"
                >
                  Explore Listing →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 bg-white/70 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-md transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 bg-white/70 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-md transition"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full transition-all ${
                i === current
                  ? "bg-indigo-600 w-6"
                  : "bg-indigo-200 hover:bg-indigo-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
