/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.storage.dev',
      },
    ],
  },
  // Output configuration for faster Vercel deployments
  output: 'standalone',
};

export default nextConfig;
