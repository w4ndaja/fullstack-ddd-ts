import { Logger } from "@/common/libs/logger";
import { EBookStatus } from "@/common/utils/book-status";
import { Book, IBook } from "@/domain/model/book";
import { IBookRepository, IMentorRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { AuthService } from "./auth-service";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { PaymentStatus } from "@/common/utils/payment-status";
import { EROLES } from "@/common/utils/roles";

@injectable()
export class BookService {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository,
    @inject(TYPES.Logger) private logger: Logger
  ) {}
  async book(
    mentorId: string,
    sessions: string[],
    className: string,
    paymentMethod: string,
    paymentAccountNo: string,
				duration:number,
  ): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const mentorDto = await this.mentorRepository.findById(mentorId);
    const bookEntity = Book.create({
      bookId: Date.now().toString() + Math.floor(Math.random() * 9999).toString(),
      status: EBookStatus.PENDING.toString(),
      participantId: auth.userId,
      mentor: {
        userId: mentorDto.userId,
        mentorId: mentorDto.id,
        name: mentorDto.fullname,
        avatarUrl: mentorDto.avatarUrl,
      },
      className: className,
      duration: duration,
      payment: {
        method: paymentMethod,
        adminFee: 0,
        tax: 0,
        subTotal: 0,
        total: 0,
        date: Date.now(),
        accountNo: paymentAccountNo,
        expiredAt: Date.now() + 86400000 * 2,
        paidAt: null,
        status: PaymentStatus.PENDING.toString(),
      },
      expiredDate: Date.now() + 86400000 * 2,
      participantName: auth?.user?.fullname || "",
      sessions: sessions,
    });
    this.logger.info("Auth", auth)
    bookEntity.setPrice(sessions.length, mentorDto.price);
    const bookDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookDto);
    return bookDto;
  }

  async accept(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!auth.user.hasRole(EROLES.MENTOR)) {
      throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
    }
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.accept();
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async reject(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!auth.user.hasRole(EROLES.MENTOR)) {
      throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
    }
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.reject(auth.user.id);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async setPaid(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!auth.user.hasRole(EROLES.MENTOR)) {
      throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
    }
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.setPaid();
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async cancel(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.cancel(auth.user.id);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async history(status: EBookStatus): Promise<IBook[]> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (auth.user.hasRole(EROLES.MENTOR)) {
      const books = await this.bookRepository.getByMentorId(auth.userId, status);
      return books;
    } else if (auth.user.hasRole(EROLES.PARTICIPANT)) {
      const books = await this.bookRepository.getByParticipantId(auth.userId, status);
      return books;
    }
    return [];
  }

  async detail(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    return bookEntity.unmarshall();
  }

  async finish(bookId: string): Promise<IBook> {
    const auth = this.authService.auth;
    if (!auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.finish(auth.userId);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }
}
