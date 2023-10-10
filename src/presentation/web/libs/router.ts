import { Router as RouterExpress } from "express";

export class Router {
  private router: RouterExpress = RouterExpress();
  protected routes: RouterExpress = RouterExpress();
  constructor(private prefix: string = "/") {
    this.router.use(this.prefix, this.routes);
  }
  public getRouter(): RouterExpress {
    return this.router;
  }
}
