import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sassymoms.com.au",
        pathname: "/wp-content/uploads/**", // Allow all images under /wp-content/uploads/
      },
    ],
  },

};

export default nextConfig;
