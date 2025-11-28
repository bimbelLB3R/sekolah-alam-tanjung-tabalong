// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [60, 70, 75, 80, 85, 90], // ✅ kompress image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foto-presensigurusatt.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig;

