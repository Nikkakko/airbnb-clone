/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/",
        port: "",
      },
    ],
  },
};

export default nextConfig;
