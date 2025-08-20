import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // TEMPORAL - solo para emergencia
  },
  typescript: {
    ignoreBuildErrors: true, // TEMPORAL - solo para emergencia
  },
};

export default nextConfig;
