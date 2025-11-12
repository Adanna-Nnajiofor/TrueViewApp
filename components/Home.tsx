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
import {
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Rocket,
} from "lucide-react";

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const [isPaused, setIsPaused] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroMedia = [
    "/videos/hero1.mp4",
    "/videos/hero2.mp4",
    "/videos/hero3.mp4",
    "/videos/hero4.mp4",
    "/videos/hero5.mp4",
    "/videos/hero6.jpg",
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = heroRef.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setPx((prev) => prev * 0.86 + x * 0.14);
      setPy((prev) => prev * 0.86 + y * 0.14);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let raf = 0;
    const scrollSpeed = 0.6;
    const step = () => {
      if (container && !isPaused && !lightboxOpen) {
        container.scrollLeft += scrollSpeed;
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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const w = container.clientWidth;
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

  const scrollToSlide = (offset = 0) => {
    const container = scrollRef.current;
    if (!container) return;
    const w = container.clientWidth;
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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setIsPaused(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsPaused(false);
  };

  const yTransformLarge = useTransform(scrollY, [0, 800], [0, -60]);
  const yTransformSmall = useTransform(scrollY, [0, 800], [0, -28]);

  const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, ease: "easeOut" },
    }),
  };

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
        {/* Mute / Unmute */}
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="absolute z-50 bottom-8 right-6 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition"
          aria-label={isMuted ? "Unmute videos" : "Mute videos"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Hero scroll */}
        <div
          ref={scrollRef}
          className="flex h-full w-full overflow-x-hidden snap-x snap-mandatory"
          style={{ transform: `translate3d(${px * 10}px, ${py * 6}px, 0)` }}
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
                    style={{ pointerEvents: "none" }}
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Slide ${visibleIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Arrows */}
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

        {/* Hero overlay text */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl w-full backdrop-blur-md bg-white/8 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl"
            role="region"
            aria-labelledby="hero-heading"
          >
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500"
              style={{
                backgroundSize: "200% 200%",
                backgroundPosition: `${
                  (currentIndex / heroMedia.length) * 100
                }% 50%`,
                transition: "background-position 8s linear",
              }}
            >
              Reliable Property Coverage • 360° Tours • Visual Excellence
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              We deliver cinematic tours, aerial cinematography and tailored
              visual solutions for real estate, hospitality and tourism.
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
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  const demoIndex = heroMedia.findIndex((s) =>
                    s.endsWith(".mp4")
                  );
                  openLightbox(demoIndex >= 0 ? demoIndex : 0);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white bg-black/20 font-semibold"
              >
                🎬 Watch Demo Reel
              </motion.button>
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

      {/* ============ MAIN SECTIONS ============ */}
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

        {/* Testimonials */}
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

        {/* Why Choose Us */}
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
                  icon: <Camera size={28} className="text-indigo-600" />,
                },
                {
                  title: "Expert Listings",
                  desc: "Curated tours and media that highlight value and design.",
                  icon: <Video size={28} className="text-indigo-600" />,
                },
                {
                  title: "Trusted Service",
                  desc: "Fast delivery, reliable support and secure asset delivery.",
                  icon: <Rocket size={28} className="text-indigo-600" />,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
                  <p className="text-gray-700">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BECOME A HOST SECTION ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="py-20 text-white relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(270deg, #6366F1, #8B5CF6, #EC4899)",
            backgroundSize: "600% 600%",
            animation: "gradient-slide 16s ease infinite",
          }}
        >
          <motion.div
            className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.div
              className="md:w-2/3 text-center md:text-left"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <motion.h3 className="text-3xl md:text-4xl font-bold mb-4">
                Have a space to share?
              </motion.h3>
              <motion.p className="text-lg md:text-xl text-white/90 mb-6">
                Become a host and list your property with us. Earn money while
                showcasing your space to a wide audience.
              </motion.p>
            </motion.div>

            <motion.div className="flex gap-4">
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 80 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                }}
              >
                <Link
                  href="/host"
                  className="px-6 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  Become a Host
                </Link>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -80 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                }}
              >
                <a
                  href="#contact"
                  className="px-6 py-3 border border-white/50 rounded-full font-semibold hover:bg-white/20 transition"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          <style jsx>{`
            @keyframes gradient-slide {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>
        </motion.section>
      </main>
    </div>
  );
}
