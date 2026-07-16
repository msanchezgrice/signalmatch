import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SignalMatch",
    short_name: "SignalMatch",
    description:
      "Performance-based creator partnerships for AI products and trusted audiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#070a13",
    theme_color: "#7057ff",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
