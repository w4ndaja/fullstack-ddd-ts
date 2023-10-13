import { inject, injectable } from "inversify";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";
import { Listeners } from "./listeners";

@injectable()
export class SocketServer {
  public declare io: Server;
  constructor(@inject(TYPES.Logger) private logger: Logger, private listeners: Listeners) {}
  setServer(httpServer: HttpServer) {
    this.io = new Server(httpServer);
    this.listeners.setServer(this.io);
  }
}
