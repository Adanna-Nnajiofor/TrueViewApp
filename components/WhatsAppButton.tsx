import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/2348012345678?text=Hello%20TrueView!%20I’d%20like%20to%20make%20an%20inquiry."
      target="_blank"
      className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg animate-pulse hover:scale-110 transition"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppButton;
