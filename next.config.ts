import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep old indexed routes where known. Add verified legacy URL mappings
  // only after crawling the production site and reviewing Search Console exports.
  async redirects() {
    return [
      // Next normalizes trailing slashes before matching redirects. One rule
      // therefore covers both /materials and /materials/ without looping.
      { source: "/materials", destination: "/all-materials/", permanent: true }
    ];
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }, { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }]
  }
};

export default nextConfig;
