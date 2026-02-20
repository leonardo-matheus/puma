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
        hostname: 'localhost',
      },
    ],
    domains: [
      'pumamultimarcasmatao.com.br',
      'i.ibb.co',
      'ibb.co',
      'localhost',
    ],
  },
}

module.exports = nextConfig
