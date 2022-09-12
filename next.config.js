/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['bs-nft-marketplace.infura-ipfs.io']
  }
}

module.exports = nextConfig
