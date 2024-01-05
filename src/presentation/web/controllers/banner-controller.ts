import { injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { BannerService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { Banner, IBannerCreate } from "@/domain/model/banner";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

@injectable()
export class BannerController extends Router {
  constructor(private _bannerService: BannerService) {
    super("/banners");
    this.routes.get("/", asyncWrapper(this.getAllBanners.bind(this)));
    this.routes.get("/:id", asyncWrapper(this.getBannerById.bind(this)));
    this.routes.put("/", asyncWrapper(this.saveBanner.bind(this)));
  }
  private async getAllBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { page, limit, search } = req.query;
    const result = await this._bannerService.findAll({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
    });
    res.json(RestMapper.dtoToRest(result));
  }
  private async getBannerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const result = await this._bannerService.findById(String(id));
    res.json(RestMapper.dtoToRest(result));
  }
  private async saveBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bannerReq = <IBannerCreate>req.body;
    const bannerDto = await this._bannerService.save(bannerReq);
    res.json(RestMapper.dtoToRest(bannerDto));
  }
}
