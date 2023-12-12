import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { EROLES } from "@/common/utils/roles";
import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthMiddleware {
  @inject(AuthService) private declare _authService: AuthService;
  async authenticated(req: Request, res: Response, next: NextFunction) {
    const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
    await this._authService.checkToken(token);
    next();
  }

  async hasRole(role: EROLES) {
    const _this = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      const auth = await _this._authService.auth;
      if (!auth?.user.hasRole(role)) {
        throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
      }
      next();
    };
  }
}
