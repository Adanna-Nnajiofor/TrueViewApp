// lib/types.ts

export interface Listing {
  slug: string;
  title: string;
  location: string;
  price: string;
  category: string; // e.g. Real Estate, Tourism, Shortlet, Commercial
  thumbnail: string; // image path
  tourUrl: string;
  featured?: boolean; // optional
  trending?: boolean; // optional future use
  previewVideo?: string; // iframe URL for virtual tour
}

export interface HostListing {
  id: string; // Firestore document ID
  hostId: string; // UID of logged-in host
  name: string; // Name of the space
  spaceType: string; // Category/type of space
  location: string; // Address or area
  message: string; // Text description
  media: string[]; // Array of image URLs
}
