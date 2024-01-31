const config = require("dotenv");
const path = require("path");

config.config({
  override: true,
  path: path.join("../../../", process.env.NODE_ENV === "production" ? ".env.production" : ".env"),
});

/** @type {import('next').NextConfig} */
module.exports = {
  distDir: "../../../dist/presentation/web/.next",
  basePath: process.env.APP_URL_PREFIX === "/" ? "" : process.env.APP_URL_PREFIX,
  transpilePackages: [
    "@zegocloud/zego-uikit-prebuilt",
    "zego-express-engine-webrtc",
    "zego-zim-web",
  ],
  poweredByHeader: false,
};
