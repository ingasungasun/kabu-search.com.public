/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    if (process.env.DOCKER_NPM_COMMAND_ARG === "dev") {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /\/(\.\w+|node_modules|prisma|public)\//,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/stocks/:ticker/performances/:slug",
        destination: "/stocks/:ticker/performances",
        permanent: true,
      },
      {
        source: "/stocks/:ticker/indicators/:slug",
        destination: "/stocks/:ticker/indicators?period_end=:slug",
        permanent: true,
      },
      {
        source: "/stocks/:ticker/documents/:statement/:slug",
        destination: "/stocks/:ticker/documents/:statement?period_end=:slug",
        permanent: true,
      },
    ];
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  allowedDevOrigins: ["kabu-search.internal", "prod.kabu-search.internal"],
};

module.exports = nextConfig;
