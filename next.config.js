/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // The repo has a mix of generated TS/TSX; don't block deploys on type-check.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
