/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.cnodejs.org'],
  },
  experimental: {
    urlImports: ['https://cdn.tiny.cloud/'],
  },
}

module.exports = nextConfig
