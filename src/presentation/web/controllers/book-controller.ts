import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { BookService } from "@/services";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { EBookStatus } from "@/common/utils/book-status";
import { AuthMiddleware } from "../middlewares/auth-middleware";

@injectable()
export class BookController extends Router {
  constructor(
    private bookService: BookService,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    super("/books");
    this.routes.use(asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)));
    this.routes.post("/", asyncWrapper(this.book.bind(this)));
    this.routes.get("/history", asyncWrapper(this.history.bind(this)));
    this.routes.put("/:bookId/accept", asyncWrapper(this.accept.bind(this)));
    this.routes.put("/:bookId/reject", asyncWrapper(this.reject.bind(this)));
    this.routes.put("/:bookId/cancel", asyncWrapper(this.cancel.bind(this)));
    this.routes.put("/:bookId/set-paid", asyncWrapper(this.setPaid.bind(this)));
    this.routes.get("/:bookId/detail", asyncWrapper(this.detail.bind(this)));
    this.routes.put("/:bookId/finish", asyncWrapper(this.finish.bind(this)));
  }
  private async book(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      mentorId,
      duration,
      sessions,
      className,
      paymentMethod,
      paymentAccountNo,
      sessionDate,
    } = <any>req.body;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.book(
      mentorId,
      sessions,
      className,
      paymentMethod,
      paymentAccountNo,
      duration,
      sessionDate
    );
    res.json(RestMapper.dtoToRest(book));
  }

  private async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.accept(bookId);
    res.json(RestMapper.dtoToRest(book));
  }

  private async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.reject(bookId);
    res.json(RestMapper.dtoToRest(book));
  }

  private async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.cancel(bookId);
    res.json(RestMapper.dtoToRest(book));
  }

  private async history(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { status } = req.query;
    this.bookService.setAuth(res.locals.auth);
    const books = await this.bookService.history(<EBookStatus>status);
    res.json(RestMapper.dtoToRest(books));
  }

  private async setPaid(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.setPaid(bookId);
    res.json(RestMapper.dtoToRest(book));
  }

  private async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.detail(bookId);
    res.json(RestMapper.dtoToRest(book));
  }

  private async finish(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { bookId } = req.params;
    const { rating = 5, review = "" } = req.body;
    this.bookService.setAuth(res.locals.auth);
    const book = await this.bookService.finish(bookId, Number(rating), String(review));
    res.json(RestMapper.dtoToRest(book));
  }
}
