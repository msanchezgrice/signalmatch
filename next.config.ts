import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://127.0.0.1:3100"],
};

export default nextConfig;
