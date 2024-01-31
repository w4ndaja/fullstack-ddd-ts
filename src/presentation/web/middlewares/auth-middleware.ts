import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { EPERMISSIONS } from "@/common/utils/permissions";
import { EROLES } from "@/common/utils/roles";
import { Auth, IAuth } from "@/domain/model";
import { TYPES } from "@/ioc/types";
import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthMiddleware {
  @inject(AuthService) private declare _authService: AuthService;
  @inject(TYPES.Logger) private declare logger: Logger;
  async authenticated(req: Request, res: Response, next: NextFunction) {
    try {
      const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
      const auth = await this._authService.checkToken(token);
      res.locals["auth"] = auth;
    } catch (e) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized!");
    }
    next();
  }

  hasRole(role: EROLES) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const authDto = <IAuth>res.locals.auth;
      const auth = Auth.create(authDto);
      if (!auth?.user.hasRole(role)) {
        throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
      }
      next();
    };
  }
  
  hasPermission(permission: EPERMISSIONS) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const authDto = <IAuth>res.locals.auth;
      const auth = Auth.create(authDto);
      console.log(`!auth?.user.hasPermission(permission) ${!auth?.user.hasPermission(permission)}`)
      if (!auth?.user.hasPermission(permission)) {
        throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
      }
      next();
    };
  }
  
}
