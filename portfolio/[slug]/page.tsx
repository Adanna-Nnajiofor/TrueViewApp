import portfolioItems from "../../data/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default function PortfolioDetailPage({ params }: Props) {
  const item = portfolioItems.find((p) => p.slug === params.slug);

  if (!item) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Title & Category */}
      <h1 className="text-4xl font-bold text-gray-800">{item.title}</h1>
      <p className="text-gray-500 mt-1">{item.category}</p>

      {/* Media Renderer */}
      <div className="mt-8 w-full h-[500px] bg-gray-200 rounded overflow-hidden flex items-center justify-center">
        {item.mediaType === "image" && (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}

        {item.mediaType === "video" && (
          <iframe
            width="100%"
            height="100%"
            src={item.mediaUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        )}

        {item.mediaType === "360" && (
          <iframe
            src={item.mediaUrl}
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
          ></iframe>
        )}
      </div>

      {/* Description Placeholder */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Project Description</h2>
        <p className="text-gray-600">
          More project details coming soon. This section will describe the
          location, client, production gear used, and any behind-the-scenes
          footage or client testimonials.
        </p>
      </div>
    </div>
  );
}
