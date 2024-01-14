import { Logger } from "@/common/libs/logger";
import { config } from "@/common/utils";
import { generateToken04 } from "@/infra/zego-server-assistant/zego-server-assistant";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class ZegoService {
  constructor(@inject(TYPES.Logger) private _logger: Logger) {}
  public generateToken04(userId: string, effectiveTimeInSeconds: number, payload?: string) {
    const appID = Number(config.zego.appId);
    const secret = config.zego.secret;
    const result = generateToken04(appID, userId, secret, effectiveTimeInSeconds, payload);
    return result;
  }
}
