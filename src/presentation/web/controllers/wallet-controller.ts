import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { WalletService } from "@/services";
import { IAuth } from "@/domain/model";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { EROLES } from "@/common/utils/roles";

@injectable()
export class WalletController extends Router {
  constructor(
    @inject(WalletService) private walletService: WalletService,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    super("/wallet");
    this.routes.use(
      asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)),
      asyncWrapper(this.authMiddleware.hasRole(EROLES.MENTOR))
    );
    this.routes.get("/", asyncWrapper(this.getMyWallet.bind(this)));
  }
  private async getMyWallet(req: Request, res: Response, next: NextFunction) {
    const auth = <IAuth>res.locals.auth;
    const result = await this.walletService.findByUserId(auth.userId);
    res.json(RestMapper.dtoToRest(result));
  }
}
