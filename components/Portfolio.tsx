"use client";

import portfolioItems from "@/data/portfolio";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Our Visual Works
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          From real estate showcases to tourism documentaries and brand
          cinematography — explore some of our most immersive 360°, drone, and
          cinematic projects.
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.slug}
            className="relative overflow-hidden rounded-lg shadow-lg bg-white group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/portfolio/${item.slug}`}>
              {/* Image with hover zoom */}
              <div className="overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-500 transform group-hover:scale-110"
                />
              </div>

              {/* Overlay & CTA */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-lg bg-indigo-600 px-4 py-2 rounded">
                  View Project
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-gray-900 font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{item.category}</p>
              </div>

              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {item.category}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Want TrueView to showcase your space?
        </h2>
        <p className="text-gray-600 mb-6">
          Book a demo, request a 360° tour, or get a cinematic video tailored
          for your property or brand.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="#contact"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded shadow hover:bg-indigo-700 transition"
          >
            Request a Quote
          </Link>
          <Link
            href="#listings"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded hover:bg-indigo-50 transition"
          >
            View Tours
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
