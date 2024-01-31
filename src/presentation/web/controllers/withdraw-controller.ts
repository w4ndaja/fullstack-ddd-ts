import { WithdrawService } from "@/services";
import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { EROLES } from "@/common/utils/roles";
import { NextFunction, Request, Response } from "express";
import { IAuth } from "@/domain/model";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { EPERMISSIONS } from "@/common/utils/permissions";

@injectable()
export class WithdrawController extends Router {
  constructor(
    @inject(WithdrawService) private withdrawService: WithdrawService,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    super("/withdraw");
    this.routes.use(asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)));
    this.routes.get(
      "/histories",
      asyncWrapper(this.authMiddleware.hasRole(EROLES.MENTOR).bind(this.authMiddleware)),
      asyncWrapper(this.histories.bind(this))
    );
    this.routes.post(
      "/request",
      asyncWrapper(this.authMiddleware.hasRole(EROLES.MENTOR).bind(this.authMiddleware)),
      asyncWrapper(this.requestWithdraw.bind(this))
    );
    this.routes.put(
      "/:withdrawId/process",
      asyncWrapper(this.authMiddleware.hasPermission(EPERMISSIONS.PROGRESS_WD).bind(this.authMiddleware)),
      asyncWrapper(this.processWithdraw.bind(this))
    );
    this.routes.put(
      "/:withdrawId/finish",
      asyncWrapper(this.authMiddleware.hasPermission(EPERMISSIONS.FINISH_WD).bind(this.authMiddleware)),
      asyncWrapper(this.finishWithdraw.bind(this))
    );
    this.routes.put(
      "/:withdrawId/reject",
      asyncWrapper(this.authMiddleware.hasPermission(EPERMISSIONS.REJECT_WD).bind(this.authMiddleware)),
      asyncWrapper(this.rejectWithdraw.bind(this))
    );
  }

  private async histories(req: Request, res: Response, next: NextFunction) {
    const auth = <IAuth>res.locals.auth;
    const result = await this.withdrawService.history(auth.userId);
    res.json(RestMapper.dtoToRest(result));
  }
  
  private async requestWithdraw(req: Request, res: Response, next: NextFunction) {
    const auth = <IAuth>res.locals.auth;
    const { amount } = req.body;
    const result = await this.withdrawService.requestWithdraw(auth.userId, amount);
    res.json(RestMapper.dtoToRest(result));
  }

  private async processWithdraw(req: Request, res: Response, next: NextFunction) {
    const { withdrawId } = req.params;
    const result = await this.withdrawService.process(withdrawId);
    res.json(RestMapper.dtoToRest(result));
  }

  private async finishWithdraw(req: Request, res: Response, next: NextFunction) {
    const { withdrawId } = req.params;
    const result = await this.withdrawService.finish(withdrawId);
    res.json(RestMapper.dtoToRest(result));
  }

  private async rejectWithdraw(req: Request, res: Response, next: NextFunction) {
    const { withdrawId } = req.params;
    const result = await this.withdrawService.reject(withdrawId);
    res.json(RestMapper.dtoToRest(result));
  }
}
