import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flyers uploaded from /tickets/admin (Vercel Blob)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/flyers/**" },
    ],
  },
};

export default nextConfig;
