/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
}

export default nextConfig
