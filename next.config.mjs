/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    NEXT_PUBLIC_ABLY_CLIENT_KEY: process.env.NEXT_PUBLIC_ABLY_CLIENT_KEY,
  },
};

export default nextConfig;
