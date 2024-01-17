import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { Auth, IAuth, User } from "@/domain/model";
import { Book } from "@/domain/model/book";
import { ChatSession, IChatSession } from "@/domain/model/chat-session";
import { Mentor } from "@/domain/model/mentor";
import {
  IBookRepository,
  IChatSessionRepository,
  IMentorRepository,
  IUserRepository,
} from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class ChatSesssionService {
  private auth: Auth;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.ChatSessionRespository) private chatSessionRepository: IChatSessionRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository
  ) {}
  public async startChat(mentorId: string): Promise<IChatSession> {
    let chatSessionDto: IChatSession | null = null;
    const mentorDto = await this.mentorRepository.findById(mentorId);
    let [bookDto, mentorUserDto] = await Promise.all([
      this.bookRepository.findByParticipantAndMentorId(this.auth.userId, mentorId),
      this.userRepository.findById(mentorDto.userId),
    ]);
    const mentorUser = User.create(mentorUserDto);
    const participant = this.auth.user;
    let book: Book | undefined = bookDto ? Book.create(bookDto) : undefined;
    if (book) {
      if (book?.isExpired()) {
        this.logger.info("book expired =>", book.expiredDate.toLocaleString())
        book = undefined;
        bookDto = null;
      }else{
        chatSessionDto = await this.chatSessionRepository.findByBookId(book.id);
        if (!book.start) {
          book.startChat();
        }
        this.bookRepository.save(book.unmarshall());
      }
    } else {
      chatSessionDto = await this.chatSessionRepository.findByUserAndMentorId(
        this.auth.userId,
        mentorUser.id
      );
    }
    if (!chatSessionDto) {
      chatSessionDto = ChatSession.create({
        mentor: mentorUser.unmarshall(),
        participant: participant.unmarshall(),
        book: book?.unmarshall() || undefined,
      }).unmarshall();
    }
    const chatSession = ChatSession.create(chatSessionDto);
    if (!chatSession.startAt) {
      chatSession.start(chatSession.book ? chatSession.book.duration : 1);
    }
    chatSessionDto = chatSession.unmarshall();
    chatSessionDto = await this.chatSessionRepository.save(chatSessionDto);
    return chatSessionDto;
  }
  public async setAuth(auth: IAuth) {
    this.auth = Auth.create(auth);
  }
}
