/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: { formats: ["image/avif", "image/webp"] },
};
export default nextConfig;
