"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import {
  FaUserCircle,
  FaUser,
  FaList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#listings", label: "Listings" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // 🔵 Section Scroll Tracking
  const updateIndicator = () => {
    if (typeof window === "undefined") return;

    const scrollPos = window.scrollY + window.innerHeight / 3;
    for (const link of links) {
      const section = document.querySelector(link.href) as HTMLElement | null;
      if (section) {
        if (
          section.offsetTop <= scrollPos &&
          scrollPos < section.offsetTop + section.clientHeight
        ) {
          setActiveHref(link.href);

          const navEl = navRef.current?.querySelector(
            `a[href="${link.href}"]`
          ) as HTMLElement | null;
          if (navEl && navRef.current) {
            const rect = navEl.getBoundingClientRect();
            const parentRect = navRef.current.getBoundingClientRect();
            setIndicatorStyle({
              left: rect.left - parentRect.left,
              width: rect.width,
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      updateIndicator();
    };
    updateIndicator();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateIndicator);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const section = document.querySelector(href) as HTMLElement | null;
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleNavigate = (path: string) => {
    setDropdownOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="#home" className="text-2xl font-bold text-blue-600">
          True<span className="text-gray-800">View</span>
        </Link>

        {/* Desktop Nav */}
        <div
          className="hidden md:flex space-x-6 text-gray-700 font-medium relative"
          ref={navRef}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeHref === link.href ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {link.label}
            </a>
          ))}
          <span
            className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </div>

        {/* User Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full hover:bg-blue-100 transition"
            >
              {userData?.photoURL ? (
                <Image
                  src={userData.photoURL}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border border-blue-600"
                />
              ) : (
                <FaUserCircle className="text-blue-600 text-2xl" />
              )}
              <span className="text-sm font-medium text-gray-800">
                {userData?.displayName || user?.displayName || "User"}
              </span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-3 z-50"
                >
                  <div className="px-4 pb-3 border-b border-gray-100 text-center">
                    {userData?.photoURL ? (
                      <Image
                        src={userData.photoURL}
                        alt="User Avatar"
                        width={60}
                        height={60}
                        className="mx-auto rounded-full border-2 border-blue-600"
                      />
                    ) : (
                      <FaUserCircle className="mx-auto text-gray-300 text-5xl" />
                    )}
                    <h3 className="mt-2 font-semibold text-gray-800">
                      {userData?.displayName || user?.displayName || "User"}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {userData?.email || user?.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 gap-2 transition"
                    >
                      <FaUser className="text-blue-600" />
                      View Profile
                    </button>
                    <button
                      onClick={() => handleNavigate("/listings")}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 gap-2 transition"
                    >
                      <FaList className="text-blue-600" />
                      My Listings
                    </button>
                    <button
                      onClick={() => handleNavigate("/settings")}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 gap-2 transition"
                    >
                      <FaCog className="text-blue-600" />
                      Settings
                    </button>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 gap-2 transition"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col space-y-1 z-50"
        >
          <span
            className={`w-6 h-1 bg-gray-800 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-1 bg-gray-800 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-1 bg-gray-800 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md flex flex-col px-4 py-4 space-y-2 transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`py-2 text-gray-700 hover:text-blue-600 transition relative font-medium ${
              activeHref === link.href ? "text-blue-600 font-semibold" : ""
            }`}
          >
            {link.label}
          </a>
        ))}

        {user ? (
          <>
            <button
              onClick={() => handleNavigate("/profile")}
              className="py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-left py-2 text-red-600 hover:bg-red-50 transition rounded-md px-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
