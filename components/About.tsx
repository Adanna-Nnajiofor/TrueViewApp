"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  CreditCard,
  Megaphone,
  Video as VideoIcon,
  Sparkles,
  ShieldCheck,
  MapPin,
} from "lucide-react";

/**
 * ABOUT — TrueView
 * Cinematic, immersive, and experience-driven space discovery platform.
 * By Adanna Nnajiofor.
 */

const STATS = [
  { label: "Spaces Viewed", value: 12000 },
  { label: "Bookings Completed", value: 4500 },
  { label: "Cities Covered", value: 25 },
  { label: "Partner Hosts", value: 850 },
];

const HOW_IT_WORKS = [
  {
    title: "Discover",
    desc: "Browse curated spaces — apartments, studios, and getaways — crafted to inspire your next experience.",
    icon: <Globe size={28} className="text-indigo-600" />,
  },
  {
    title: "Experience",
    desc: "Enjoy cinematic video tours and 360° visuals that let you feel the space before you step in.",
    icon: <VideoIcon size={28} className="text-indigo-600" />,
  },
  {
    title: "Book",
    desc: "Follow secure host links to reserve or enquire — transparent and effortless.",
    icon: <CreditCard size={28} className="text-indigo-600" />,
  },
  {
    title: "List",
    desc: "Showcase your property beautifully and reach thousands of active explorers.",
    icon: <Megaphone size={28} className="text-indigo-600" />,
  },
];

export default function About() {
  const [counters, setCounters] = useState(() => STATS.map(() => 0));
  const rafRef = useRef<number | null>(null);

  // Animated counters
  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    const from = STATS.map(() => 0);
    const to = STATS.map((s) => s.value);

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const vals = to.map((end, i) =>
        Math.round(from[i] + (end - from[i]) * ease)
      );
      setCounters(vals);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <main id="about" className="font-sans text-gray-900 antialiased">
      {/* HERO */}
      <header className="relative h-[75vh] overflow-hidden">
        <video
          src="/videos/hero-urban-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-pulse-slow"
          style={{ filter: "brightness(0.8) contrast(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl"
          >
            Experience Spaces Like Never Before
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-md md:text-lg text-gray-200 max-w-2xl"
          >
            TrueView transforms how you explore, book, and share spaces —
            bringing every room, view, and detail to life through cinematic
            storytelling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:brightness-105 transition"
            >
              Explore Spaces
            </Link>
            <Link
              href="/host"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              List Your Space
            </Link>
          </motion.div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How TrueView Works
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-gray-600 max-w-3xl mx-auto mb-14"
          >
            Discover, experience, and book. TrueView bridges visual storytelling
            with simplicity and trust.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-full">
                    {card.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRUEVIEW */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">
            Why Choose TrueView?
          </motion.h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-10">
            We blend technology, design, and trust to help explorers and hosts
            connect through powerful visual experiences.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <VideoIcon />,
                title: "Cinematic Previews",
                text: "See every space in motion with dynamic, emotional visuals.",
              },
              {
                icon: <MapPin />,
                title: "Immersive 360° Tours",
                text: "Navigate spaces interactively — like you’re already there.",
              },
              {
                icon: <ShieldCheck />,
                title: "Verified Hosts",
                text: "Every listing is secure, verified, and trustworthy.",
              },
              {
                icon: <Sparkles />,
                title: "Effortless Flow",
                text: "From viewing to booking — it all feels beautifully seamless.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="flex justify-center text-indigo-600 mb-3">
                  {item.icon}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h3 {...fadeUp} className="text-3xl font-bold mb-10">
            Our Impact
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-tr from-indigo-600 to-pink-500 text-white rounded-2xl shadow-lg"
              >
                <div className="text-4xl font-extrabold">
                  {counters[i].toLocaleString()}
                </div>
                <div className="mt-2 text-sm opacity-90">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="py-24 bg-gradient-to-r from-indigo-700 to-purple-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Your Space Deserves TrueView
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="max-w-2xl mx-auto text-indigo-100 mb-8"
          >
            Whether you host or explore, TrueView lets people fall in love with
            spaces before they even arrive.
          </motion.p>

          <div className="flex justify-center gap-4">
            <Link
              href="/listings"
              className="px-6 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
            >
              Start Exploring
            </Link>
            <Link
              href="/host"
              className="px-6 py-3 border border-white/30 rounded-full font-semibold hover:bg-white/10 transition"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
