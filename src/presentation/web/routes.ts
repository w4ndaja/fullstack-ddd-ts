import { injectable } from "inversify";
import { AuthController } from "./controllers/auth-controller";
import { Router } from "./libs/router";
import { UserController } from "./controllers/user-controller";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

@injectable()
export class Routes extends Router {
  constructor(private authController: AuthController, private userController: UserController) {
    super();
    this.getRouter().get("/health-check", async (req, res) => res.send("SERVER IS UP"));
    this.getRouter().use(this.authController.getRouter());
    this.getRouter().use(this.userController.getRouter());
    this.getRouter().all("*", async (req, res, next) => {
      next(new AppError(ErrorCode.NOT_FOUND, "Not found"));
    });
  }
}
