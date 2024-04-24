// const path = require("path");

// /** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    // outputFileTracingRoot: path.join(__dirname, "../../"),
    // serverActions: {
    //   bodySizeLimit: "15mb",
    // },
  },
  reactStrictMode: true,
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["kecyi.com", "genai.kecyi.com"],
    remotePatterns: [],
  },
};

export default nextConfig;
