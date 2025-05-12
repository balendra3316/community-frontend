import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost', 
      'example.com',
      // Add any other domains you'll use for course images
    ],
  },
};

export default nextConfig;
