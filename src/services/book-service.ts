import { Logger } from "@/common/libs/logger";
import { EBookStatus } from "@/common/utils/book-status";
import { Book, IBook } from "@/domain/model/book";
import {
  IBookRepository,
  IMentorRepository,
  IParticipantRepository,
  IUserRepository,
} from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { PaymentStatus } from "@/common/utils/payment-status";
import { EROLES } from "@/common/utils/roles";
import { Auth, IAuth } from "@/domain/model";
import { Mentor } from "@/domain/model/mentor";

@injectable()
export class BookService {
  private auth: Auth;
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository,
    @inject(TYPES.Logger) private logger: Logger
  ) {}
  async book(
    mentorId: string,
    sessions: string[],
    className: string,
    paymentMethod: string,
    paymentAccountNo: string,
    duration: number,
    sessionDate: number
  ): Promise<IBook> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    let [mentorDto, participantDto] = await Promise.all([
      this.mentorRepository.findById(mentorId),
      this.participantRepository.findByUserId(this.auth.userId),
    ]);
    const mentorUserDto = await this.userRepository.findById(mentorDto.userId);
    const mentor = Mentor.create(mentorDto);
    const bookEntity = Book.create({
      participantId: this.auth.userId,
      mentor: {
        userId: mentorDto.userId,
        mentorId: mentorDto.id,
        name: mentorDto.fullname,
        avatarUrl: mentorDto.avatarUrl,
        email: mentorUserDto.email,
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
      participantName: this.auth?.user?.fullname || "",
      sessions: sessions,
      sessionDate: sessionDate,
      mentorFee: mentor.mentorFee,
      providerFee: mentor.providerFee,
      participantAvatar: participantDto.avatarUrl,
    });
    bookEntity.setPrice(sessions.length, mentorDto.price);
    const bookDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookDto);
    return bookDto;
  }

  async accept(bookId: string): Promise<IBook> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!this.auth.user.hasRole(EROLES.MENTOR)) {
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
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!this.auth.user.hasRole(EROLES.MENTOR)) {
      throw new AppError(ErrorCode.FORBIDDEN, "Forbidden");
    }
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.reject(this.auth.user.id);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async setPaid(bookId: string): Promise<IBook> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (!this.auth.user.hasRole(EROLES.MENTOR)) {
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
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.cancel(this.auth.user.id);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  async history(status: EBookStatus): Promise<IBook[]> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    if (this.auth.user.hasRole(EROLES.MENTOR)) {
      const books = await this.bookRepository.findAllByMentorId(this.auth.userId, status);
      return books;
    } else if (this.auth.user.hasRole(EROLES.PARTICIPANT)) {
      const books = await this.bookRepository.findAllByParticipantId(this.auth.userId, status);
      return books;
    }
    return [];
  }

  async detail(bookId: string): Promise<IBook> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const [mentorUserDto, participantDto] = await Promise.all([
      this.userRepository.findById(bookDto.mentor.userId),
      this.participantRepository.findByUserId(bookDto.participantId),
    ]);
    const bookEntity = Book.create(bookDto);
    bookEntity.participantAvatar = participantDto.avatarUrl;
    bookEntity.mentor.email = mentorUserDto.email;
    return bookEntity.unmarshall();
  }

  async finish(bookId: string, rating: number, review: string): Promise<IBook> {
    if (!this.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const bookDto = await this.bookRepository.findById(bookId);
    if (!bookDto) throw new AppError(ErrorCode.NOT_FOUND, "Not found");
    const bookEntity = Book.create(bookDto);
    bookEntity.finish(this.auth.userId, rating, review);
    const bookUpdateDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookUpdateDto);
    return bookUpdateDto;
  }

  public setAuth(auth: IAuth) {
    this.auth = Auth.create(auth);
  }
}
