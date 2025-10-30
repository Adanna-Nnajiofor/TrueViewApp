import { notFound } from "next/navigation";
import listings from "../../data/listings";
import { Listing } from "@/lib/types";

interface Props {
  params: { slug: string };
}

export default function ListingDetailPage({ params }: Props) {
  const listing = listings.find((item: Listing) => item.slug === params.slug);

  if (!listing) return notFound(); // Handles invalid slugs

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Title & Info */}
      <h1 className="text-4xl font-bold text-gray-800">{listing.title}</h1>
      <p className="text-gray-500 mt-1">{listing.location}</p>
      <p className="text-blue-600 font-semibold mt-2">{listing.price}</p>

      {/* 360° Virtual Tour */}
      <div className="mt-8 w-full h-[500px] bg-gray-200 rounded overflow-hidden">
        <iframe
          src={listing.tourUrl}
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      {/* Description Placeholder */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">About this Location</h2>
        <p className="text-gray-600">
          Full description coming soon. This space will include more details
          about the property, features, accessibility, contact details, and
          booking process. For now, enjoy the virtual experience!
        </p>
      </div>
    </div>
  );
}
