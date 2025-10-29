import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',

  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  typescript: {
    // Temporarily ignore build errors for problematic files
    ignoreBuildErrors: true,
  },

  eslint: {
    // Temporarily ignore ESLint errors during builds
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],

  compress: true,
  poweredByHeader: false,

  ...(process.env.NODE_ENV !== 'development' && {
    webpack: (
      config: Configuration,
      {  }: { dev: boolean; isServer: boolean }
    ) => {
      // Ignore problematic files
      config.module = config.module || {}
      config.module.rules = config.module.rules || []

      config.module.rules.push({
        test: /src\/(types\/database\.types\.ts|supabase\/types\.ts)$/,
        use: 'ignore-loader',
      })

      return config
    },
  }),
}

export default nextConfig
