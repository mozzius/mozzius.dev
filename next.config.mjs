import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amanita.us-east.host.bsky.network",
        pathname: "/xrpc/com.atproto.sync.getBlob",
        // search: '?did=did%3Aplc%3Ap2cp5gopk7mgjegy6wadk3ep&cid=**',
      },
    ],
  },
};

export default withPlausibleProxy({
  src: "https://plausible.mozzius.dev/js/pa-9Z9tz6awtn6xUA8Zs_MyY.js",
})(nextConfig);
