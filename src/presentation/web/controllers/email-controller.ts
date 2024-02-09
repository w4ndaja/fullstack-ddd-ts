import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { EmailService } from "@/services/email-service";
import { RestMapper } from "@/dto/mappers/rest-mapper";

@injectable()
export class EmailController extends Router {
  constructor(@inject(EmailService) private emailService: EmailService) {
    super("/mail");
    this.routes.post("/subscribe", asyncWrapper(this.subscribe.bind(this)));
  }
  private async subscribe(req: Request, res: Response, next: NextFunction) {
    await this.emailService.subscribe(
      req.body.email,
      req.body.password,
      req.body.token
    );
    res.json(RestMapper.dtoToRest({}));
  }
}
