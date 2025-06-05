import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: Add basePath if you're deploying to a subdirectory
  // basePath: '/your-base-path',
};

export default nextConfig;
