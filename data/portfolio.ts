interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  thumbnail: string;
  mediaType: "image" | "video" | "360";
  mediaUrl: string; // Could be video link, image, or 360 iframe
}

const portfolioItems: PortfolioItem[] = [
  {
    slug: "lekki-mansion-photoshoot",
    title: "Luxury Mansion Photography - Lekki Phase 1",
    category: "Real Estate Photography",
    thumbnail: "/images/portfolio/lekki-mansion.jpg",
    mediaType: "image",
    mediaUrl: "/images/portfolio/lekki-mansion-gallery.jpg",
  },
  {
    slug: "ngwo-resort-drone-tour",
    title: "Drone Aerial Tour - Hilltop Resort",
    category: "Tourism / Drone Coverage",
    thumbnail: "/images/portfolio/ngwo-drone.jpg",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/embed/YOUR-VIDEO-ID",
  },
  {
    slug: "abuja-office-360",
    title: "360° Walkthrough - Abuja Corporate Office",
    category: "360 Virtual Tour",
    thumbnail: "/images/portfolio/abuja-360.jpg",
    mediaType: "360",
    mediaUrl: "https://momento360.com/e/YOUR-360-LINK",
  },
  {
    slug: "wedding-film-highlights",
    title: "Wedding Highlight Film",
    category: "Cinematography",
    thumbnail: "/images/portfolio/wedding-film.jpg",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/embed/YOUR-WEDDING-VIDEO",
  },
  {
    slug: "hotel-suite-showcase",
    title: "Presidential Suite Promo - Lagos Hotel",
    category: "Hotel / Shortlet Showcase",
    thumbnail: "/images/portfolio/hotel-suite.jpg",
    mediaType: "360",
    mediaUrl: "https://momento360.com/e/YOUR-360-LINK",
  },
];

export default portfolioItems;
