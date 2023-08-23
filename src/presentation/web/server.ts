import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { defaultConfig, normalizeConfig } from "next/dist/server/config-shared";
import path from "path";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } from "next/dist/shared/lib/constants";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
normalizeConfig(dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER, defaultConfig).then((config) => {
  const app = next({
    dev,
    dir: path.join(__dirname),
  });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port);

    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
  });
});
