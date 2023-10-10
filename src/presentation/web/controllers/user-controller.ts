import { injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { IBaseGetParam } from "@/common/libs/pagination";
import { UserService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { RestMapper } from "@/dto/mappers/rest-mapper";

@injectable()
export class UserController extends Router {
  constructor(private userService: UserService) {
    super("/users");
    this.routes.get("/", asyncWrapper(this.getUsers.bind(this)));
  }
  private async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { page, limit, search } = req.query;
    const result = await this.userService.findAll({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
    });
    res.json(RestMapper.dtoToRest(result));
  }
}
