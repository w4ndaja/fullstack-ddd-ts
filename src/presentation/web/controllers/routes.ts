import { Router } from "express";
import { injectable } from "inversify";
import { AuthController } from "./auth-controller";

@injectable()
export class Routes {
  private router: Router = Router();
  constructor(
    private authController: AuthController,
  ) {
    this.router.get("/health-check", async (req, res) => res.send("SERVER IS UP"));
    this.router.use(this.authController.getRouter());
  }
  public getRouter() {
    return this.router;
  }
}
