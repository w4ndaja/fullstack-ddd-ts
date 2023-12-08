import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthMiddleware {
  @inject(AuthService) private declare _authService: AuthService;
  async authenticated(req: Request, res: Response, next: NextFunction) {
    const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
    const auth = await this._authService.checkToken(token);
    next();
  }
}
