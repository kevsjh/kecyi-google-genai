// const path = require("path");

module.exports = {
  reactStrictMode: true,
  output: "standalone",
  // experimental: {
  //   outputFileTracingRoot: path.join(__dirname, "../../"),
  // },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
