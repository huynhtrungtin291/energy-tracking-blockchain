import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "192.168.1.3",
    "https://cleansingly-timorous-margarett.ngrok-free.dev",
    "https://pub-918d31dd608340478aa68ad6047e9c88.r2.dev",
    "https://pub-918d31dd608340478aa68ad6047e9c88.r2.cloudflarestorage.com",
    "http://localhost:80",
    "http://localhost:2004",
  ],
};

export default nextConfig;
