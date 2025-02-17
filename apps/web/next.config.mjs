import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build. Using jiti we can import .ts files :)
await jiti.import('./lib/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // output: 'standalone',
  transpilePackages: ['@avelin/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.avelin.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export default nextConfig
