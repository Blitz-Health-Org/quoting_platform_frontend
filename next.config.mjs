import CopyPlugin from "copy-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xabksrsyvpqlikxxwfgi.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
  },
};

export default nextConfig;
