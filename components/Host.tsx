"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function HostPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    spaceType: "",
    location: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for your interest! We'll contact you soon.");
    setFormData({
      name: "",
      email: "",
      spaceType: "",
      location: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 flex flex-col items-center text-center">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
          style={{ pointerEvents: "none" }}
        >
          <source src="/videos/host-space.mp4" type="video/mp4" />
        </motion.video>

        <div className="relative z-10 max-w-3xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900"
          >
            Turn Your Space Into an Opportunity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700 mb-8"
          >
            Showcase your apartment, workspace, or event venue to thousands of
            TrueView users. Get noticed, get booked, and grow your reach
            effortlessly.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="#host-form"
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-full shadow-md hover:bg-gray-800 transition"
          >
            List Your Space
          </motion.a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "1. Upload Your Space",
                desc: "Add photos, location, and details to showcase your space beautifully.",
              },
              {
                title: "2. Get Featured",
                desc: "Your listing appears on TrueView, ready for users to explore and book.",
              },
              {
                title: "3. Connect Instantly",
                desc: "Receive direct inquiries or bookings from verified users.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">
            Why Host with TrueView?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Reach Thousands",
                desc: "Your space gets visibility among thousands of verified users.",
              },
              {
                title: "Seamless Process",
                desc: "Our simple listing process makes it easy to get started quickly.",
              },
              {
                title: "Safe & Trusted",
                desc: "We connect you only with genuine users and verified listings.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="host-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-10">
            List Your Space
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 p-8 rounded-2xl shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type of Space
                </label>
                <input
                  type="text"
                  name="spaceType"
                  placeholder="Apartment, Studio, Hall..."
                  value={formData.spaceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your space..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl shadow-md hover:bg-gray-800 transition"
            >
              Submit Listing
            </motion.button>
          </form>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 text-center bg-gray-900 text-white">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to share your space with the world?
        </h2>
        <a
          href="#host-form"
          className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
