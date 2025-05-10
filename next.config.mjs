/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.intra.42.fr', 'cdn.intra.42.fr'],
    unoptimized: true,
  },
  // Remove i18n config as we're using middleware for internationalization
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
  // Ensure output directory is .next
  distDir: '.next',
  // Add trailing slash to ensure proper routing
  trailingSlash: true,
};

export default nextConfig;
