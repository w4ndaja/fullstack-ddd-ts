import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { ChatSesssionService } from "@/services";
import { RestMapper } from "@/dto/mappers/rest-mapper";

@injectable()
export class ChatSessionController extends Router {
  constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(ChatSesssionService) private chatSessionService: ChatSesssionService
  ) {
    super("/chat-session");
    this.routes.use(asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)));
    this.routes.post("/start/:mentorId", asyncWrapper(this.startChat.bind(this)));
  }
  private async startChat(req: Request, res: Response, next: NextFunction) {
    const { mentorId } = req.params;
    this.chatSessionService.setAuth(res.locals.auth);
    const result = await this.chatSessionService.startChat(mentorId);
    res.json(RestMapper.dtoToRest(result));
  }
}
