"use client";

import { useEffect, useState } from "react";
import {
  FaHome,
  FaMapMarkedAlt,
  FaBed,
  FaBuilding,
  FaGlobe,
  FaSearch,
  FaSortAmountDown,
} from "react-icons/fa";

import ListingCard from "@/components/ListingCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "../context/AuthProvider";

type PublicListing = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  category: string;
  thumbnail: string;
  tourUrl: string;
  featured: boolean;
};

export default function ListingsPage() {
  const { userData } = useAuth(); // <-- get userData
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("title-asc");
  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

  const categories = [
    "All",
    "Real Estate",
    "Tourism",
    "Shortlet",
    "Commercial",
  ];

  // Fetch listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hostSpaces"));

        const data: PublicListing[] = snapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            slug: doc.id,
            title: d.name,
            location: d.location,
            price: "Contact for price",
            category: d.spaceType,
            thumbnail: d.media?.[0] || "/images/placeholder.jpg",
            tourUrl: d.media?.[0] || "/images/placeholder.jpg",
            featured: d.featured || false,
          };
        });

        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter and search listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      normalize(item.category) === normalize(selectedCategory);

    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    const getPrice = (p: string) => parseInt(p?.replace(/[^\d]/g, "")) || 0;

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

  // Featured listings
  const featuredListings = listings.filter((item) => item.featured);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500 text-lg">
        Loading listings...
      </div>
    );
  }

  return (
    <div id="listings" className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative h-[50vh] bg-gradient-to-r from-indigo-600 to-indigo-400 flex items-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Explore Spaces Before You Arrive
          </h1>
          <p className="mt-4 text-white/90 max-w-xl">
            Browse virtual tours uploaded by hosts across Nigeria.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center">Discover By Category</h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm transition
                ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-indigo-50"
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

      {/* FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Featured Listings
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onToggleFeatured={(id, newStatus) =>
                  setListings((prev) =>
                    prev.map((l) =>
                      l.id === id ? { ...l, featured: newStatus } : l
                    )
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* SEARCH & SORT */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaSortAmountDown />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-4 py-2.5 rounded-lg"
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

      {/* MAIN LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {sortedListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onToggleFeatured={(id, newStatus) =>
                  setListings((prev) =>
                    prev.map((l) =>
                      l.id === id ? { ...l, featured: newStatus } : l
                    )
                  )
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-12">No listings found.</p>
        )}
      </section>
    </div>
  );
}
