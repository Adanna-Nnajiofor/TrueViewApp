"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Let us Connect
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Whether it is a real estate, tourism, or cinematic project, we are
          ready to bring your vision to life. Reach out and let's create
          something extraordinary.
        </p>
      </div>

      {/* Quick Action Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-indigo-600 text-white rounded-3xl p-6 mb-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <h2 className="text-xl md:text-2xl font-semibold">
          Want a demo 360° scan or a cinematic video?
        </h2>
        <div className="flex gap-4">
          <a
            href="#contact"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition flex items-center gap-2"
          >
            Book a Demo <FaArrowRight />
          </a>
          <a
            href="https://wa.me/2348031234567"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-green-600 transition flex items-center gap-2"
          >
            WhatsApp Us <FaWhatsapp />
          </a>
        </div>
      </motion.div>

      {/* Contact Cards + Form */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white rounded-3xl p-10 shadow-2xl overflow-hidden group"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-6 text-white/90">
            We would love to collaborate with you on your next project. Choose
            your preferred way to reach us.
          </p>

          <div className="space-y-4 text-white">
            <p className="flex items-center gap-3 hover:gap-4 transition-all duration-300">
              <FaPhoneAlt className="text-white" /> +234 803 123 4567
            </p>
            <p className="flex items-center gap-3 hover:gap-4 transition-all duration-300">
              <FaEnvelope className="text-white" /> info@trueview.com
            </p>
            <p className="flex items-center gap-3 hover:gap-4 transition-all duration-300">
              📍 Independence Layout, Enugu, Nigeria
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-8">
            <a
              href="#"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-indigo-700 transition shadow"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-pink-600 transition shadow"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-sky-500 transition shadow"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-blue-800 transition shadow"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-10 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-indigo-100 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-indigo-100 rounded-full blur-3xl"></div>

          <div className="flex flex-col relative">
            <input
              type="text"
              placeholder="Your Name"
              className="peer w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent"
            />
            <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-indigo-600 peer-focus:text-sm bg-white/0 px-1">
              Full Name
            </label>
          </div>

          <div className="flex flex-col relative">
            <input
              type="email"
              placeholder="Your Email"
              className="peer w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent"
            />
            <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-indigo-600 peer-focus:text-sm bg-white/0 px-1">
              Email Address
            </label>
          </div>

          <div className="flex flex-col relative">
            <textarea
              placeholder="Your Message"
              rows={5}
              className="peer w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent"
            ></textarea>
            <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-indigo-600 peer-focus:text-sm bg-white/0 px-1">
              Message
            </label>
          </div>

          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">
            Send Message
          </button>
        </motion.form>
      </div>

      {/* Google Map with Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl relative group"
      >
        <iframe
          src="https://www.google.com/maps?q=Independence+Layout,+Enugu&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        ></iframe>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-semibold">
          Explore our Location →
        </div>
      </motion.div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348031234567"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-5 rounded-full shadow-2xl hover:bg-green-600 transition z-50"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} />
      </a>
    </section>
  );
}
