export interface Listing {
  slug: string;
  title: string;
  location: string;
  price: string;
  category: string; // e.g. Real Estate, Tourism, Shortlet, Commercial
  thumbnail: string; // image path
  tourUrl: string;
  featured?: boolean; //  optional property
  trending?: boolean; // optional future use
  previewVideo?: string; // iframe URL for virtual tour
}
