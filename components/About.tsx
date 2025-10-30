"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const teamMembers = [
  {
    name: "Duke Smith",
    role: "Founder & Creative Director",
    img: "/team/duke.jpg",
  },
  { name: "Emeka Obi", role: "Head of Cinematography", img: "/team/emeka.jpg" },
  {
    name: "Chioma Okafor",
    role: "360° Tour Specialist",
    img: "/team/chioma.jpg",
  },
  {
    name: "Tunde Adebayo",
    role: "Drone Pilot & Visual Effects",
    img: "/team/tunde.jpg",
  },
];

const stats = [
  { label: "Projects Completed", value: 1250 },
  { label: "Satisfied Clients", value: 980 },
  { label: "Cities Covered", value: 15 },
  { label: "Drone Flights", value: 4500 },
];

export default function About() {
  const [counters, setCounters] = useState(stats.map(() => 0));

  // Animate counters
  useEffect(() => {
    const intervals = stats.map((stat, idx) => {
      const step = Math.ceil(stat.value / 100);
      return setInterval(() => {
        setCounters((prev) => {
          const newCounters = [...prev];
          if (newCounters[idx] < stat.value) {
            newCounters[idx] += step;
            if (newCounters[idx] > stat.value) newCounters[idx] = stat.value;
          }
          return newCounters;
        });
      }, 20);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Floating Gradient Shapes */}
      <div className="absolute -top-32 -left-16 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-spin-slow" />
      <div className="absolute top-32 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-spin-slow delay-500" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-20"
        >
          About <span className="text-indigo-600">True View</span>
        </motion.h1>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition"
          >
            <video
              src="https://videos.pexels.com/video-files/5495892/5495892-uhd_2160_3840_24fps.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <p className="text-white text-lg font-bold animate-pulse">
                Capturing Stories in 360°
              </p>
            </div>
          </motion.div>

          {/* Company Story */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Reimagining How People Experience Spaces
            </h2>
            <p className="text-gray-700 mb-4">
              True View delivers immersive <strong>360° virtual tours</strong>,{" "}
              <strong>drone cinematography</strong>, and{" "}
              <strong>interactive media</strong> for real estate, hospitality,
              and tourism. Our work transforms spaces into stories.
            </p>
            <p className="text-gray-700">
              From properties to tourist destinations, we connect audiences to
              experiences before they even step in, making every interaction
              unforgettable.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <p className="text-4xl font-extrabold text-indigo-600">
                {counters[i]}
                {stat.label.includes("Clients") ||
                stat.label.includes("Projects")
                  ? "+"
                  : ""}
              </p>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {[
            {
              title: "Our Mission",
              text: "Connect people to spaces before they step in, using immersive technology that excites, convinces, and sells.",
            },
            {
              title: "Our Vision",
              text: "To be Africa’s No.1 Virtual Experience Partner for developers, creators, and dreamers.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-50 to-pink-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 text-center p-6"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={140}
                  height={140}
                  className="mx-auto rounded-full mb-4 ring-4 ring-indigo-100"
                />
                <h4 className="font-semibold text-lg">{member.name}</h4>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Let us Build Your Next Showcase
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            From luxury homes to tourist destinations, we will capture every
            detail with cinematic flair.
          </p>
          <Link
            href="#contact"
            className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
