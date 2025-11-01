"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import listings from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * HomePage — Cinematic TrueView
 * - Hero: auto horizontal looping video carousel (duplicate technique)
 * - Parallax mouse movement + scroll-driven parallax
 * - Section reveal animations using whileInView
 * - Lightbox video preview
 *
 * Tweak: scrollSpeed, scrollStep, media list, and timing to taste.
 */

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const [isPaused, setIsPaused] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hero media (local files in /public/videos)
  const heroMedia = [
    "/videos/hero1.mp4",
    "/videos/hero2.mp4",
    "/videos/hero3.mp4",
    "/videos/hero4.mp4",
    "/videos/hero5.mp4",
  ];

  // --- mouse parallax for hero ---
  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = heroRef.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      // gentle smoothing
      setPx((prev) => prev * 0.86 + x * 0.14);
      setPy((prev) => prev * 0.86 + y * 0.14);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  // --- continuous auto-scroll for hero (duplicate technique for seamless loop) ---
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let raf = 0;
    const scrollSpeed = 0.6; // px per frame (adjust)
    const step = () => {
      if (container && !isPaused && !lightboxOpen) {
        container.scrollLeft += scrollSpeed;
        // reset to the first half when we've scrolled past it
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft =
            container.scrollLeft - container.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, lightboxOpen]);

  // --- compute currentIndex from scroll position ---
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const w = container.clientWidth;
        // limit to original length using modulo
        const idx = Math.round(
          (container.scrollLeft % (w * heroMedia.length)) / w
        );
        setCurrentIndex(idx);
        ticking = false;
      });
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [heroMedia.length]);

  // --- scroll to slide (one page) helper (wrap aware) ---
  const scrollToSlide = (offset = 0) => {
    const container = scrollRef.current;
    if (!container) return;
    const w = container.clientWidth;
    // current base index (within 0..n-1)
    const baseIndex = Math.round(
      (container.scrollLeft % (w * heroMedia.length)) / w
    );
    const target = baseIndex + offset;
    const wrapped = (target + heroMedia.length) % heroMedia.length;
    const half = container.scrollWidth / 2;
    const candidates = [wrapped * w, wrapped * w + half];
    const curr = container.scrollLeft;
    const nearest = candidates.reduce((a, b) =>
      Math.abs(a - curr) < Math.abs(b - curr) ? a : b
    );
    container.scrollTo({ left: nearest, behavior: "smooth" });
  };

  const scrollByAmount = (direction: "left" | "right") =>
    scrollToSlide(direction === "right" ? 1 : -1);

  // --- lightbox handlers ---
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setIsPaused(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsPaused(false);
  };

  // --- scroll-driven parallax for section backgrounds ---
  // Transform values used for subtle background translate on scroll
  const yTransformLarge = useTransform(scrollY, [0, 800], [0, -60]); // slow ascent
  const yTransformSmall = useTransform(scrollY, [0, 800], [0, -28]);

  // --- framer variants for reveal ---
  const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, ease: "easeOut" },
    }),
  };

  // --- reduce animations if user prefers reduced motion ---
  if (prefersReducedMotion) {
    // make animations lighter by setting scroll speed low
  }

  return (
    <div id="home" className="font-sans text-gray-900 antialiased">
      {/* ================= HERO ================= */}
      <header
        ref={heroRef}
        className="relative h-[92vh] lg:h-[88vh] overflow-hidden"
        onMouseEnter={() => {
          setIsPaused(true);
          setShowArrows(true);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setShowArrows(false);
        }}
        aria-roledescription="hero"
      >
        {/* Mute / Unmute Button */}
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="absolute z-50 bottom-8 right-6 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition"
          aria-label={isMuted ? "Unmute videos" : "Mute videos"}
        >
          {isMuted ? (
            // Muted Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 9v6h4l5 5V4l-5 5H9z"
              />
            </svg>
          ) : (
            // Sound Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5L6 9H2v6h4l5 4V5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.54 8.46a5 5 0 010 7.07m2.83-9.9a9 9 0 010 12.73"
              />
            </svg>
          )}
        </button>
        {/* Scrolling container (duplicated media set for infinite loop) */}
        <div
          ref={scrollRef}
          className="flex h-full w-full overflow-x-hidden snap-x snap-mandatory"
          style={{
            // subtle parallax transform
            transform: `translate3d(${px * 10}px, ${py * 6}px, 0)`,
          }}
        >
          {[...heroMedia, ...heroMedia].map((src, idx) => {
            const visibleIndex = idx % heroMedia.length;
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-full relative snap-start"
                role="group"
                aria-label={`Hero slide ${visibleIndex + 1}`}
                onClick={() => openLightbox(visibleIndex)}
              >
                {src.endsWith(".mp4") ? (
                  <video
                    src={src}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    // prevent video controls from stealing clicks
                    style={{ pointerEvents: "none" }}
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Slide ${visibleIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* caption + index */}
                <div className="absolute left-6 bottom-6 text-white z-20">
                  <div className="text-xs uppercase tracking-wide text-indigo-200/90">
                    Experience
                  </div>
                  <div className="font-semibold text-lg md:text-xl drop-shadow-lg">{`Tour ${
                    visibleIndex + 1
                  }`}</div>
                  {/* overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
                </div>

                {/* center play hint */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 3v18l15-9L5 3z"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* top progress + index */}
        <div className="absolute left-6 right-6 top-6 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-white/90 font-medium">
              {`0${currentIndex + 1}`}/{`0${heroMedia.length}`}
            </div>
            <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / heroMedia.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-sm text-white/70">{/* placeholder */}</div>
          </div>
        </div>

        {/* arrows */}
        <motion.button
          onClick={() => scrollByAmount("left")}
          initial={{ opacity: 0 }}
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-40 backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          onClick={() => scrollByAmount("right")}
          initial={{ opacity: 0 }}
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-40 backdrop-blur-md"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </motion.button>

        {/* Hero text overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl"
            role="region"
            aria-labelledby="hero-heading"
          >
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
            >
              Reliable Property Coverage • 360° Tours • Visual Excellence
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              We deliver cinematic tours, aerial cinematography and tailored
              visual solutions for real estate, hospitality and tourism —
              trusted, fast and professional.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 30px rgba(99,102,241,0.18)",
                }}
                className="inline-block bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform-gpu"
                href="#listings"
              >
                Explore Virtual Tours
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                className="inline-block border border-white/20 bg-white/8 text-white px-6 py-3 rounded-full font-semibold backdrop-blur-sm"
                href="#contact"
              >
                Contact Us
              </motion.a>
            </div>

            <div className="mt-4 text-xs text-gray-300">
              <span>On-site 360° capture • Drone & aerial • Fast delivery</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============ LIGHTBOX ============ */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-70 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
          <div className="w-full max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            <video
              src={heroMedia[lightboxIndex]}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* ============ SECTIONS WITH REVEAL & SCROLL PARALLAX ============ */}
      <main>
        {/* Featured Virtual Tours */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="max-w-7xl mx-auto px-6 py-20"
          variants={sectionVariant}
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Featured Virtual Tours
          </motion.h2>

          <motion.div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {listings.slice(0, 3).map((item, i) => (
              <motion.div key={item.slug} variants={sectionVariant} custom={i}>
                <ListingCard listing={item} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              href="#listings"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
            >
              View All Listings →
            </Link>
          </div>
        </motion.section>

        {/* Testimonials with slight scroll-parallax background */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="py-12 bg-gradient-to-b from-white/60 to-gray-50"
          style={{ transform: yTransformSmall ? undefined : undefined }}
          variants={sectionVariant}
        >
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.h3 className="text-2xl md:text-3xl font-semibold mb-8">
              What clients say
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Chinedu",
                  text: "TrueView's 360 tours changed the way we sell properties.",
                },
                {
                  name: "Laila",
                  text: "Amazing capture and quick delivery. Bookings increased.",
                },
                {
                  name: "Ola",
                  text: "Professional — drone shots are crisp and beautiful.",
                },
              ].map((t, idx) => (
                <motion.blockquote
                  key={idx}
                  className="p-6 bg-white rounded-xl shadow"
                  variants={sectionVariant}
                  custom={idx}
                >
                  <p className="text-gray-800 mb-3">“{t.text}”</p>
                  <footer className="text-sm text-gray-500">— {t.name}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="bg-gradient-to-b from-white/50 to-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariant}
              className="text-3xl font-bold mb-10"
            >
              Why Choose TrueView?
            </motion.h3>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Immersive Experience",
                  desc: "High-fidelity 360° tours that let buyers explore every corner.",
                },
                {
                  title: "Expert Listings",
                  desc: "Curated tours and media that highlight value and design.",
                },
                {
                  title: "Trusted Service",
                  desc: "Fast delivery, reliable support and secure asset delivery.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
                  <p className="text-gray-700">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="max-w-6xl mx-auto px-6 bg-indigo-700 rounded-2xl text-white p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-semibold">
                Ready to showcase your space?
              </h4>
              <p className="text-sm text-indigo-100/90">
                Book a demo scan or request a tailored media package.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="#pricing"
                className="px-4 py-2 bg-white text-indigo-700 rounded-md font-semibold"
              >
                View Pricing
              </Link>
              <a
                href="https://wa.me/2348012345678?text=Hello%20TrueView!%20I%27d%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* moving gradient overlay for hero slides */
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 14s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
