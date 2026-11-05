import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flyers uploaded from /tickets/admin (varese-tickets Blob store only)
      { protocol: "https", hostname: "nob65es0f2yzdzmu.public.blob.vercel-storage.com", pathname: "/flyers/**" },
    ],
  },
};

export default nextConfig;
