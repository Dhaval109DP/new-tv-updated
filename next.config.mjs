/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/parties/:path*',
        destination: 'http://127.0.0.1:1999/parties/:path*'
      }
    ]
  }
};

export default nextConfig;
