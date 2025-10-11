// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foto-presensigurusatt.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig;

