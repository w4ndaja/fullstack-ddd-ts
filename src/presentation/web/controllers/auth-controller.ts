import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { asyncWrapper } from "../libs";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { Router } from "../libs/router";

@injectable()
export class AuthController extends Router {
  constructor(private authService: AuthService) {
    super("/auth");
    this.routes.post(`/validate-credential`, asyncWrapper(this.validateCredentials.bind(this)));
    this.routes.get(`/validate-token`, asyncWrapper(this.validateToken.bind(this)));
  }
  private async validateCredentials(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const auth = await this.authService.validate(username, password);
    res.json(RestMapper.dtoToRest(auth));
  }
  private async validateToken(req: Request, res: Response, next: NextFunction) {
    const [, token] = <string[]>req.get("Authorization")?.split("Bearer ");
    const auth = await this.authService.validateToken(token);
    res.json(RestMapper.dtoToRest(auth));
  }
}
