import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this block to configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;