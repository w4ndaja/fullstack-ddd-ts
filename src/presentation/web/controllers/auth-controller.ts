import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { asyncWrapper } from "../libs";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { Router } from "../libs/router";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";
import { AuthValidateParamMapper } from "@/dto/mappers/auth/auth-validate-param-mapper";

@injectable()
export class AuthController extends Router {
  constructor(private authService: AuthService) {
    super("/auth");
    this.routes.post(`/validate-credential`, asyncWrapper(this.validateCredentials.bind(this)));
    this.routes.get(`/validate-token`, asyncWrapper(this.validateToken.bind(this)));
  }
  private async validateCredentials(req: Request, res: Response, next: NextFunction) {
    const { email, password } = AuthValidateParamMapper.fromRest(req.body);
    const auth = await this.authService.validate(email, password);
    res.json(RestMapper.dtoToRest(auth));
  }
  private async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
      const auth = await this.authService.validateToken(token);
      res.json(RestMapper.dtoToRest(auth));
    } catch (e) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid token");
    }
  }
}
