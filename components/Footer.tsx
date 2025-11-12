import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/listings", label: "Listings" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-semibold">TrueView</h2>
          <p className="text-sm mt-2">
            Bringing Real Estate, Tourism, and Experiences to life through 360°
            Virtual Tours, Photography & Filmmaking.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: info@trueview.com</p>
          <p className="text-sm">Phone: +234 801 234 5678</p>
          <p className="text-sm mt-2">Independence Layout, Enugu, Nigeria</p>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <Link href="#" className="hover:text-blue-400">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <FaYoutube />
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs border-t border-gray-700 py-4">
        © {new Date().getFullYear()} TrueView • All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
