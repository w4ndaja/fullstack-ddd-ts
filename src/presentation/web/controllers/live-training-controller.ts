import { injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { LiveTrainingService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { EROLES } from "@/common/utils/roles";
import { ILiveTrainingStatus } from "@/domain/model/live-training";

@injectable()
export class LiveTrainingController extends Router {
  constructor(
    private authMiddleware: AuthMiddleware,
    private liveTrainingService: LiveTrainingService
  ) {
    super("/live-training");
    this.routes.get("/", asyncWrapper(this.getAllByStatus.bind(this)));
    this.routes.use(asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)));
    this.routes.post(
      "/create",
      asyncWrapper(this.authMiddleware.hasRole(EROLES.MENTOR).bind(this.authMiddleware)),
      asyncWrapper(this.create.bind(this))
    );
    this.routes.post("/book", asyncWrapper(this.book.bind(this)));
    this.routes.put("/:liveTrainingId/authorize", asyncWrapper(this.authorize.bind(this)));
    this.routes.put("/:liveTrainingBookId/set-paid", asyncWrapper(this.setPaid.bind(this)));
    this.routes.post("/:liveTrainingId/join", asyncWrapper(this.join.bind(this)));
    this.routes.put(
      "/:liveTrainingId/finish",
      asyncWrapper(this.authMiddleware.hasRole(EROLES.MENTOR).bind(this.authMiddleware)),
      asyncWrapper(this.finish.bind(this))
    );
  }
  private async create(req: Request, res: Response, next: NextFunction) {
    const {
      title,
      startAt,
      maxAudiens,
      thumbnailUrl,
      context,
      contextFilesUrl,
      price,
      mentorFee,
      providerFee,
    } = req.body;
    this.liveTrainingService.setAuth(res.locals.auth);
    const result = await this.liveTrainingService.create(
      title,
      startAt,
      maxAudiens,
      thumbnailUrl,
      context,
      contextFilesUrl,
      price,
      mentorFee,
      providerFee
    );
    res.json(RestMapper.dtoToRest(result));
  }

  private async authorize(req: Request, res: Response, next: NextFunction) {
    const { liveTrainingId } = req.params;
    this.liveTrainingService.setAuth(res.locals.auth);
    const result = await this.liveTrainingService.authorize(liveTrainingId);
    res.json(RestMapper.dtoToRest(result));
  }

  private async book(req: Request, res: Response, next: NextFunction) {
    const { liveTrainingId, participants, payment } = req.body;
    this.liveTrainingService.setAuth(res.locals.auth);
    const result = await this.liveTrainingService.book(liveTrainingId, participants, payment);
    res.json(RestMapper.dtoToRest(result));
  }

  private async getAllByStatus(req: Request, res: Response, next: NextFunction) {
    const { search, page, limit, status } = req.query;
    const result = await this.liveTrainingService.getAllByStatus(
      { search: String(search), limit: Number(limit), page: Number(page) },
      <ILiveTrainingStatus>status
    );
    res.json(RestMapper.dtoToRest(result));
  }

  private async setPaid(req: Request, res: Response, next: NextFunction) {
    const { liveTrainingBookId } = req.params;
    this.liveTrainingService.setAuth(res.locals.auth);
    const result = await this.liveTrainingService.setPaid(liveTrainingBookId);
    res.json(RestMapper.dtoToRest(result));
  }

  private async join(req: Request, res: Response, next: NextFunction) {
    const { liveTrainingId } = req.params;
    this.liveTrainingService.setAuth(res.locals.auth);
    const result = await this.liveTrainingService.join(liveTrainingId);
    res.json(RestMapper.dtoToRest(result));
  }

  private async finish(req: Request, res: Response, next: NextFunction) {
    const { liveTrainingId } = req.params;
    const result = await this.liveTrainingService.finish(liveTrainingId);
    res.json(RestMapper.dtoToRest(result));
  }
}
