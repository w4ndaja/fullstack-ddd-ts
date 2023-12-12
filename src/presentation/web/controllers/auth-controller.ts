import { AuthService, ProfileService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { asyncWrapper } from "../libs";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { Router } from "../libs/router";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";
import { AuthValidateParamMapper } from "@/dto/mappers/auth/auth-validate-param-mapper";
import { AuthMiddleware } from "../middlewares/auth-middleware";

@injectable()
export class AuthController extends Router {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private authMiddleware: AuthMiddleware
  ) {
    super("/auth");
    this.routes.post(`/login`, asyncWrapper(this.login.bind(this)));
    this.routes.get(`/check-token`, asyncWrapper(this.checkToken.bind(this)));
    this.routes.post("/register", asyncWrapper(this.register.bind(this)));
    this.routes.get(
      "/profile",
      asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)),
      asyncWrapper(this.profile.bind(this))
    );
  }
  private async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = AuthValidateParamMapper.fromRest(req.body);
    const auth = await this.authService.login(email, password);
    res.json(RestMapper.dtoToRest(auth));
  }
  private async checkToken(req: Request, res: Response, next: NextFunction) {
    const auth = await this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid token");
    res.json(RestMapper.dtoToRest(auth?.unmarshall()));
  }
  private async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = AuthValidateParamMapper.fromRest(req.body);
    const auth = await this.authService.register(email, password);
    res.json(RestMapper.dtoToRest(auth));
  }
  private async profile(req: Request, res: Response, next: NextFunction) {
    const profile = await this.profileService.getProfile();
    return res.json(RestMapper.dtoToRest(<object>profile));
  }
}
