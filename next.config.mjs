/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/chickenjockey-sitestatus",
  assetPrefix: "/chickenjockey-sitestatus/",
};

export default nextConfig;