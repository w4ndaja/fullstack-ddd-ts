import { injectable } from "inversify";
import { AuthController } from "./controllers/auth-controller";
import { Router } from "./libs/router";

@injectable()
export class Routes extends Router {
  constructor(
    private authController: AuthController,
  ) {
    super();
    this.router.get("/health-check", async (req, res) => res.send("SERVER IS UP"));
    this.router.use(this.authController.getRouter());
  }
  public getRouter() {
    return this.router;
  }
}
