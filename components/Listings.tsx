"use client";

import { useState } from "react";
import listings from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import {
  FaHome,
  FaMapMarkedAlt,
  FaBed,
  FaBuilding,
  FaGlobe,
  FaSearch,
  FaSortAmountDown,
} from "react-icons/fa";
import FeaturedListings from "@/components/FeaturedListings";

export default function ListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("title-asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique categories dynamically
  const uniqueCategories = Array.from(new Set(listings.map((i) => i.category)));
  const categories = ["All", ...uniqueCategories];

  // Filter
  const filteredListings = listings.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  // Sort
  const sortedListings = [...filteredListings].sort((a, b) => {
    const getPrice = (p: string): number =>
      parseInt(p?.replace(/[^\d]/g, "")) || 0;

    switch (sortOption) {
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "location-asc":
        return a.location.localeCompare(b.location);
      case "location-desc":
        return b.location.localeCompare(a.location);
      case "price-asc":
        return getPrice(a.price) - getPrice(b.price);
      case "price-desc":
        return getPrice(b.price) - getPrice(a.price);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return (
    <div id="listings" className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative h-[50vh] md:h-[60vh] bg-gradient-to-r from-indigo-600 to-indigo-400 flex items-center">
        <div className="max-w-6xl mx-auto px-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Explore Spaces Before You Arrive
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl mx-auto md:mx-0">
            TrueView offers immersive 360° virtual tours, cinematic drone
            videos, and interactive experiences for real estate, tourism, and
            hospitality.
          </p>
          <div className="mt-6 flex justify-center md:justify-start gap-4 flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Book a Tour
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-indigo-600 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Discover By Category
        </h2>
        <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
          Choose the type of virtual experience that fits your needs — from real
          estate walkthroughs to tourism destinations.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full backdrop-blur-md border text-sm font-medium transition-all duration-300
              ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg scale-105"
                  : "bg-white/70 border-gray-200 text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {category === "Real Estate" && <FaHome />}
              {category === "Tourism" && <FaMapMarkedAlt />}
              {category === "Shortlet" && <FaBed />}
              {category === "Commercial" && <FaBuilding />}
              {![
                "All",
                "Real Estate",
                "Tourism",
                "Shortlet",
                "Commercial",
              ].includes(category) && <FaGlobe />}
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* SEARCH & SORT BAR */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 bg-white/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200 shadow-sm">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-gray-500" />
            <select
              className="border px-4 py-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title-asc">Title (A → Z)</option>
              <option value="title-desc">Title (Z → A)</option>
              <option value="location-asc">Location (A → Z)</option>
              <option value="location-desc">Location (Z → A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>
        </div>
      </section>

      <FeaturedListings featured={listings.filter((l) => l.featured)} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Sorting + Filters + Listings Grid */}
      </div>

      {/* LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {sortedListings.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              All Virtual Tours
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedListings.map((item) => (
                <ListingCard key={item.slug} listing={item} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-12 text-lg">
            No listings match your search.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">Ready to Experience TrueView?</h3>
          <p className="mt-3 text-white/90 max-w-2xl mx-auto">
            Book a 360° virtual tour, schedule a short video shoot, or request a
            custom interactive experience for your property or business.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Book a Tour
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-indigo-600 transition"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
