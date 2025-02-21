import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: "/videos",
        destination: "/api/videos",
      },
    ];
  },
};

export default nextConfig;
