import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for optimized deployment
  output: "standalone",

  // Disable image optimization if not using Vercel's image service
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
