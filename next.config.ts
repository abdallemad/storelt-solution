import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
  experimental:{
    serverActions:{
      bodySizeLimit: '100MB'
    }
  },
  typescript:{
    ignoreBuildErrors: true
  }
};

export default nextConfig;
