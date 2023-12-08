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
    this.routes.post(`/login`, asyncWrapper(this.login.bind(this)));
    this.routes.get(`/check-token`, asyncWrapper(this.checkToken.bind(this)));
    this.routes.post("/register", asyncWrapper(this.register.bind(this)));
  }
  private async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = AuthValidateParamMapper.fromRest(req.body);
    const auth = await this.authService.login(email, password);
    res.json(RestMapper.dtoToRest(auth));
  }
  private async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
      const auth = await this.authService.checkToken(token);
      res.json(RestMapper.dtoToRest(auth));
    } catch (e) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid token");
    }
  }
  private async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = AuthValidateParamMapper.fromRest(req.body);
    const auth = await this.authService.register(email, password);
    res.json(RestMapper.dtoToRest(auth));
  }
}
