/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.intra.42.fr', 'cdn.intra.42.fr'],
    unoptimized: true,
  },
  i18n: {
    locales: ['en', 'ar', 'fr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
