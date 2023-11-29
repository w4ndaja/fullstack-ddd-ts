import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { ClientService } from "@/services";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";

@injectable()
export class ClientController extends Router {
  @inject(ClientService) private declare _clientService: ClientService;
  constructor(@inject(AuthMiddleware) private _authMiddleware: AuthMiddleware) {
    super("/client");
    this.routes.get(
      `/profile`,
      asyncWrapper(this._authMiddleware.authenticated.bind(this._authMiddleware)),
      asyncWrapper(this.getProfile.bind(this))
    );
  }
  private async getProfile(req: Request, res: Response, next: NextFunction) {
    const client = await this._clientService.getProfile();
    res.json(RestMapper.dtoToRest(client));
  }
}
