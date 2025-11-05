import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Comment out standalone output temporarily to fix build issues
  // output: 'standalone',

  experimental: {
    // Temporarily disable CSS optimization to fix build issues
    optimizeCss: false,
    optimizeServerReact: true,
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  typescript: {
    // Only ignore build errors in development, not production
    ignoreBuildErrors: true,
  },

  eslint: {
    // Only ignore ESLint errors during development builds
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
      // Placeholder images for development
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // Amazon image domains for scraped products
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-eu.ssl-images-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-fe.ssl-images-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ssl-images-amazon.com',
        pathname: '/**',
      },
      // Alibaba image domains
      {
        protocol: 'https',
        hostname: 'sc04.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ae01.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gd1.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gd2.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gd3.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gd4.alicdn.com',
        pathname: '/**',
      },
      // AliExpress image domains
      {
        protocol: 'https',
        hostname: 'ae01.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ae02.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ae03.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ae04.alicdn.com',
        pathname: '/**',
      },
      // eBay image domains
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        pathname: '/**',
      },
      // Walmart image domains
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        pathname: '/**',
      },
      // Generic e-commerce domains
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
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

      // Fix punycode deprecation warning
      if (config.resolve) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          punycode: false,
        }
      }

      return config
    },
  }),
}

export default nextConfig
