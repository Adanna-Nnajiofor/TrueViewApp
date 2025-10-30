import React from "react";
import Link from "next/link";
import {
  FaCameraRetro,
  FaHelicopter,
  FaMapMarkedAlt,
  FaVideo,
  FaPaintBrush,
} from "react-icons/fa";

const ServicesPage: React.FC = () => {
  return (
    <div id="services" className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/drone-hero.mp4"
          poster="/images/services/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Experience Spaces Before You Arrive
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Premium 360° virtual tours, aerial cinematography, and cinematic
              production tailored for real estate, tourism, and hospitality
              brands.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                href="#listings"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-md font-semibold transition"
              >
                View Tours
              </Link>
              <Link
                href="#contact"
                className="inline-block bg-white text-gray-900 px-5 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Book a Shoot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Intro */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our Services
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          From immersive 360° walkthroughs to cinematic drone films, we combine
          storytelling and technology to showcase properties, destinations, and
          brands.
        </p>
      </section>

      {/* Service Blocks */}
      <section className="max-w-6xl mx-auto px-6 space-y-20 pb-16">
        {/* 360° Real Estate Tours */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <FaMapMarkedAlt size={28} />
              <h3 className="text-2xl md:text-3xl font-semibold">
                360° Real Estate Virtual Tours
              </h3>
            </div>
            <p className="mt-3 text-gray-600">
              Convert listings into immersive experiences. We capture property
              interiors with pro 360° cameras, stitch scenes, and deliver
              interactive embeds that increase time-on-listing and buyer
              conversions.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>
                Multi-scene 360 walkthroughs (Matterport / Marzipano / Custom)
              </li>
              <li>Virtual staging and hotspot info</li>
              <li>Responsive embeds for web & mobile</li>
            </ul>
            <div className="mt-6">
              <Link
                href="#listings"
                className="text-indigo-600 font-semibold hover:underline"
              >
                See 360 Tours →
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src="/images/services/360-interior.jpg"
                alt="360 interior sample"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>

        {/* Shortlet & Hotel Showcasing */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src="/images/services/hotel-suite.jpg"
                alt="hotel suite showcase"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <FaCameraRetro size={28} />
              <h3 className="text-2xl md:text-3xl font-semibold">
                Shortlet & Hotel Showcasing
              </h3>
            </div>
            <p className="mt-3 text-gray-600">
              Showcase rooms and facilities with cinematic photos, short promo
              reels, and virtual tours designed to increase bookings and guest
              confidence.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Promo reels for listing pages and social media</li>
              <li>Room-by-room 360 tours and interactive galleries</li>
              <li>Professional retouching and fast delivery</li>
            </ul>
            <div className="mt-6">
              <Link
                href="#portfolio"
                className="text-indigo-600 font-semibold hover:underline"
              >
                View Hotel Reels →
              </Link>
            </div>
          </div>
        </article>

        {/* Tourism & Destination Coverage */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <FaHelicopter size={28} />
              <h3 className="text-2xl md:text-3xl font-semibold">
                Tourism & Destination Coverage
              </h3>
            </div>
            <p className="mt-3 text-gray-600">
              We produce destination films and interactive tours that inspire
              travel, from landscape panoramas to cultural experiences,
              optimized for web and kiosks.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Location reels & 360 panoramas</li>
              <li>Guided virtual experiences for tourism boards</li>
              <li>Multi-format delivery (web, social, broadcast)</li>
            </ul>
            <div className="mt-6">
              <Link
                href="#portfolio"
                className="text-indigo-600 font-semibold hover:underline"
              >
                See Tourism Work →
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src="/images/services/tourism-landscape.jpg"
                alt="tourism landscape"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>

        {/* Drone & Film Production */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src="/images/services/drone-film.jpg"
                alt="drone cinematography"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <FaVideo size={28} />
              <h3 className="text-2xl md:text-3xl font-semibold">
                Aerial Drone & Cinematic Production
              </h3>
            </div>
            <p className="mt-3 text-gray-600">
              High-end drone cinematography and full production services, from
              script and shot lists to color grading and final deliverables.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Aerial B-roll & establishing shots</li>
              <li>Full video production: pre-pro → shoot → post</li>
              <li>Broadcast-quality deliverables and licensing</li>
            </ul>
            <div className="mt-6">
              <Link
                href="#contact"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Book Production →
              </Link>
            </div>
          </div>
        </article>

        {/* Photography & Editing */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <FaPaintBrush size={28} />
              <h3 className="text-2xl md:text-3xl font-semibold">
                Photography, Editing & Post Production
              </h3>
            </div>
            <p className="mt-3 text-gray-600">
              Professional photography and end-to-end post-production:
              retouching, color grading, motion graphics and short-form edits
              for social media.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>High-resolution architecture & interior photography</li>
              <li>Fast turnaround image editing and optimized web exports</li>
              <li>Motion design and short edits for promos</li>
            </ul>
            <div className="mt-6">
              <Link
                href="#portfolio"
                className="text-indigo-600 font-semibold hover:underline"
              >
                See Photography →
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src="/images/services/post-production.jpg"
                alt="post production"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>
      </section>

      {/* Packages CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Packages & Pricing</h3>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We offer flexible packages for businesses and individual owners.
            Contact us for a tailored quote, include property size and desired
            deliverables.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              href="#listings"
              className="px-5 py-3 bg-white border rounded-md font-semibold hover:bg-gray-100 transition"
            >
              View Pricing
            </Link>
            <Link
              href="#contact"
              className="px-5 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6 bg-indigo-600 rounded-lg text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-semibold">
              Ready to showcase your space?
            </h4>
            <p className="text-sm text-white/90">
              Book a demo 360 scan or request a short reel today.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="#contact"
              className="px-4 py-2 bg-white text-indigo-600 rounded font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/2348031234567"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
