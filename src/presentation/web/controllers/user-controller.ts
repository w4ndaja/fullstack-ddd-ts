import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { UserService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { AuthMiddleware } from "../middlewares/auth-middleware";

@injectable()
export class UserController extends Router {
  constructor(
    private userService: UserService,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    super("/users");
    this.routes.use(asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)));
    this.routes.get("/", asyncWrapper(this.getUsers.bind(this)));
    this.routes.get("/check-email", asyncWrapper(this.checkUserByEmail.bind(this)));
  }
  private async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.userService.setAuth(res.locals.auth);
    const { page, limit, search } = req.query;
    const result = await this.userService.findAll({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
    });
    res.json(RestMapper.dtoToRest(result));
  }

  private async checkUserByEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.query;
    const result = await this.userService.getByEmail(String(email));
    res.json(RestMapper.dtoToRest(result));
  }
}
