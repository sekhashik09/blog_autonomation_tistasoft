import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bloggerscafe.com.au",
        pathname: "/wp-content/uploads/**", // Allow all images under /wp-content/uploads/
      },
    ],
  },
};

export default nextConfig;