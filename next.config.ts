import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://127.0.0.1:3100"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
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
