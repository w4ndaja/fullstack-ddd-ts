import type { Logger } from "@/common/libs/logger/logger";
import { config } from "@/common/utils/config";
import { Routes } from "./routes";
import { AppError, ErrorHandler } from "@/common/libs/error-handler";

import { Server, createServer } from "http";
import { parse } from "url";
import next from "next";
import { inject, injectable } from "inversify";
import { NextServer } from "next/dist/server/next";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { TYPES } from "@/ioc/types";

@injectable()
export class WebServer {
  private host: string;
  private port: number;
  private app: NextServer;
  private declare server: Server;
  private prepared: Promise<void>;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    private routes: Routes,
    private errorHandler: ErrorHandler
  ) {
    this.host = config.app.host;
    this.port = config.app.port;
    const dev = config.app.env !== "production";
    this.app = next({
      dev,
      dir: config.presentation.dir,
    });
    const app = express();
    this.prepared = this.app.prepare();
    app.use(cors());
    app.use(config.app.apiUrlPrefix, json());
    app.use(config.app.apiUrlPrefix, (req: Request, res: Response, next: NextFunction) => {
      this.logger.info(`${req.method}::${req.url}`);
      next();
    });
    app.use(config.app.apiUrlPrefix, this.routes.getRouter());
    app.use(config.app.apiUrlPrefix, this.restErrorHandler.bind(this));
    app.use("/", this.frontEndHandler.bind(this));

    this.server = createServer(app);
    this.server.listen(this.port);
    logger.info(`Server listening at http://${this.host}:${this.port} as ${config.app.env}`);
    this.prepared.then(() => {});
  }

  private async frontEndHandler(req: Request, res: Response, next: NextFunction) {
    return this.app.getRequestHandler()(req, res, parse(req.url!, true));
  }

  private async restErrorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    const handledError = this.errorHandler.handleError(err);
    res.status(handledError.code).json({
      statusCode: handledError.code,
      message: handledError.message,
      data: handledError.data,
    });
  }
}
