import { injectable } from "inversify";
import { AuthController } from "./controllers/auth-controller";
import { Router } from "./libs/router";
import { UserController } from "./controllers/user-controller";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { MentorController } from "./controllers/mentor-controller";
import { BookController } from "./controllers/book-controller";
import { BannerController } from "./controllers/banner-controller";
import { asyncWrapper } from "./libs";
import { AuthMiddleware } from "./middlewares/auth-middleware";
import { FileController } from "./controllers/file-controller";

@injectable()
export class Routes extends Router {
  constructor(
    private authController: AuthController,
    private userController: UserController,
    private mentorController: MentorController,
    private bookController: BookController,
    private bannerController: BannerController,
    private authMiddleware: AuthMiddleware,
    private fileController: FileController
  ) {
    super();
    this.getRouter().get("/health-check", async (req, res) => res.send("SERVER IS UP"));
    this.getRouter().use(this.authController.getRouter());
    this.getRouter().use(this.userController.getRouter());
    this.getRouter().use(this.mentorController.getRouter());
    this.getRouter().use(this.bookController.getRouter());
    this.getRouter().use(this.bannerController.getRouter());
    this.getRouter().use(this.fileController.getRouter());
    this.getRouter().all("*", async (req, res, next) => {
      next(new AppError(ErrorCode.NOT_FOUND, "Not found"));
    });
  }
}
