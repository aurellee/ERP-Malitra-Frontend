import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: you’ll still see errors locally, but the build won’t fail
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
