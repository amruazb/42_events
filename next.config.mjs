/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['api.intra.42.fr', 'cdn.intra.42.fr'],
    unoptimized: true,
  },
  // Remove i18n config as it's not supported in App Router
  experimental: {
    // Fix serverActions to be an object instead of boolean
    serverActions: {
      allowedOrigins: ['localhost:3000', '42-events-iota.vercel.app'],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
