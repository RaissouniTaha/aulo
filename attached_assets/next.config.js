/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://api.mapbox.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://api.mapbox.com https://fonts.googleapis.com; img-src 'self' data: blob: https://*.mapbox.com; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; connect-src 'self' https://*.mapbox.com https://*.strapi.io https://api.govagency.gov; frame-src 'self'; object-src 'none';`,
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  i18n,
  
  // Enable image optimization
  images: {
    domains: [
      'localhost', 
      'api.govagency.gov', 
      'storage.googleapis.com', 
      'res.cloudinary.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Add security headers to all responses
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  // Handle redirects
  async redirects() {
    return [
      // Redirect root to default language
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
      // Legacy URL redirects if needed
      {
        source: '/old-url/:slug',
        destination: '/new-url/:slug',
        permanent: true,
      },
    ];
  },
  
  // Setup webpack to resolve aliases
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, '');
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['@utils'] = path.join(__dirname, 'utils');
    config.resolve.alias['@hooks'] = path.join(__dirname, 'hooks');
    config.resolve.alias['@services'] = path.join(__dirname, 'services');
    return config;
  },
  
  // Environment variables to expose to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Enable new features
  experimental: {
    // Enable app directory (for Next.js 13+)
    appDir: false,
    // Enable server components if using App Router
    serverComponents: false,
    // Configure font optimization
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin', 'arabic'] } },
    ],
  },
  
  // Configure build output
  output: 'standalone',
  
  // Configure static file serving
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  
  // Configure TypeScript
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  
  // Configure build directory
  distDir: 'build',
  
  // Configure powered by header
  poweredByHeader: false,
  
  // Configure compression
  compress: true,
  
  // Configure build ID
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'gov-agency-website-' + Date.now();
  },
  
  // Configure rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;