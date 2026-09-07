const nodeEnvironment = process.env.NODE_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";

if (!["development", "production"].includes(nodeEnvironment)) {
  throw new Error("NODE_ENVIRONMENT must be either development or production.");
}

const apiUrl = (process.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // These values are deliberately exposed without a PUBLIC-prefixed key.
  // API_URL stays server-only; browser requests use the /api rewrite below.
  env: {
    APP_URL: process.env.APP_URL ?? "http://localhost:3000",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
