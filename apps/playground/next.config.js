const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds for now
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    '@object-ui/components',
    '@object-ui/core',
    '@object-ui/react',
    '@object-ui/types',
    '@object-ui/designer',
    '@object-ui/plugin-charts',
    '@object-ui/plugin-editor',
    '@object-ui/plugin-kanban',
    '@object-ui/plugin-markdown',
  ],
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    // Add alias for @/ used in components package
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../../packages/components/src'),
    };
    return config;
  },
};

module.exports = nextConfig;
