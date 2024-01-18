import { inject, injectable } from "inversify";
import { Routes } from "../routes";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { ProfileService } from "@/services";

@injectable()
export class StorageController extends Router {
  constructor(@inject(ProfileService) private profileService: ProfileService) {
    super("/storage");
    this.routes.get("/:email", asyncWrapper(this.getAvatarByEmail.bind(this)));
  }
  private async getAvatarByEmail(req: Request, res: Response, next: NextFunction) {
    const result = await this.profileService.getAvatarFile(req.params.email);
    res.set(result.headers);
    res.send(Buffer.from(result.data));
  }
}
