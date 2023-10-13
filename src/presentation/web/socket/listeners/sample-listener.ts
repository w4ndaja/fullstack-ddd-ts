import { Logger } from "@/common/libs/logger";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { Socket } from "socket.io";

@injectable()
export class SampleListener {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}
  public setServer(socket: Socket) {
    socket.on("something-changes-on-client", (data) => {
      this.logger.info("something-changes-on-client", data);
    });
  }
}
