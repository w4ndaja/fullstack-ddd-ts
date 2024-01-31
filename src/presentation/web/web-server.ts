import type { Logger } from "@/common/libs/logger/logger";
import { config } from "@/common/utils/config";
import { Routes } from "./routes";
import { AppError, ErrorHandler } from "@/common/libs/error-handler";
import { TYPES } from "@/ioc/types";

import { Server, createServer } from "http";
import { parse } from "url";
import next from "next";
import { inject, injectable } from "inversify";
import { NextServer } from "next/dist/server/next";
import express, { NextFunction, Request, Response, Express, static as static_ } from "express";
import cors from "cors";
import { json } from "body-parser";
import path from "path";
// import { SocketServer } from "./socket/socket-server";

@injectable()
export class WebServer {
  private host: string;
  private port: number;
  private feServer: NextServer;
  private httpServer: Server;
  private fePrepared: Promise<void>;
  private restServer: Express;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    private routes: Routes,
    private errorHandler: ErrorHandler // private socketServer: SocketServer
  ) {
    this.host = config.app.host;
    this.port = config.app.port;
    this.restServer = express();
    this.feServer = next({
      dev: config.app.env !== "production",
      dir: config.presentation.dir,
    });
    this.fePrepared = this.feServer.prepare();
    this.restServer.disable("x-powered-by");
    this.restServer.use(
      config.app.apiUrlPrefix,
      (req: Request, res: Response, next: NextFunction) => {
        this.logger.info(`${req.method}::${req.url}`);
        next();
      }
    );
    this.restServer.use(config.app.apiUrlPrefix, cors());
    this.restServer.use(config.app.apiUrlPrefix, json());
    this.restServer.use(config.app.apiUrlPrefix, this.routes.getRouter());
    this.restServer.use(config.app.apiUrlPrefix, this.restErrorHandler.bind(this));
    this.restServer.use("/storage", static_(path.join(config.storageDir, "public")));
    this.restServer.use("/", this.frontEndHandler.bind(this));

    this.httpServer = createServer(this.restServer);

    // this.socketServer.setServer(this.httpServer);
    this.httpServer.listen(this.port);

    logger.info(`Server listening at http://${this.host}:${this.port} as ${config.app.env}`);
  }

  private async frontEndHandler(req: Request, res: Response, next: NextFunction) {
    await this.fePrepared;
    return this.feServer.getRequestHandler()(req, res, parse(req.url!, true));
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
