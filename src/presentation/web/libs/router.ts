import { Router as RouterExpress } from "express";

export class Router {
  public router: RouterExpress = RouterExpress();
  public routes: RouterExpress = RouterExpress();
  public prefix: string = "/";
  constructor(prefix?: string) {
    this.prefix = prefix || "/";
    this.router.use(this.prefix, this.routes);
  }
  public getRouter(): RouterExpress {
    return this.router;
  }
}
