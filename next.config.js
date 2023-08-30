/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    mongodburl:process.env.mongodburl
  }
}

module.exports = nextConfig
