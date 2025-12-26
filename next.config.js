/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep existing API routes working
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Environment variables
  env: {
    VITE_SITE_URL: process.env.VITE_SITE_URL || 'https://marketingwithvibes.com',
  },
  // Output configuration
  output: 'standalone',
};

export default nextConfig;
