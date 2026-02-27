import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore
  turbopack: {
    root: './',
  },
  experimental: {
    staticGenerationRetryCount: 0,
  },
};

export default nextConfig;
