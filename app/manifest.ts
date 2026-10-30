import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SafeGuard AI - Multimodal Scam Detection",
    short_name: "SafeGuard AI",
    description: "Deterministic Zero-Fetch Phishing, Smishing, and Scams Inspection Shield",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    share_target: {
      action: "/",
      method: "get",
      params: [
        { name: "title", value: "title" },
        { name: "text", value: "text" },
        { name: "url", value: "url" },
      ],
    },
  };
}
