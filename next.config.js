/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    domains: ['images.unsplash.com', 'i.pravatar.cc', 'picsum.photos', 'travelwithme-dev-file.s3.ap-northeast-2.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080',
  },
};

module.exports = nextConfig; 