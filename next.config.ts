import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://127.0.0.1:3100"],
  async redirects() {
    return [
      {
        source: "/resources/attribution-spec-for-creator-campaigns",
        destination: "/resources/attribution-plan-for-creator-campaigns",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
