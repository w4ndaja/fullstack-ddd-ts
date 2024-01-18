import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { Auth, IAuth, IParticipant, Participant, User } from "@/domain/model";
import { Book } from "@/domain/model/book";
import { ChatSession, IChatSession } from "@/domain/model/chat-session";
import { IMentor, Mentor } from "@/domain/model/mentor";
import {
  IBookRepository,
  IChatSessionRepository,
  IMentorRepository,
  IParticipantRepository,
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
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository
  ) {}
  public async startChat(mentorEmail: string): Promise<IChatSession> {
    let chatSessionDto: IChatSession | null = null;
    const targetUserDto = await this.userRepository.findByUsernameOrEmail(mentorEmail);
    if (!targetUserDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Email not found!");
    }
    let targetProfileDto: IMentor | IParticipant = await this.mentorRepository.findByUserId(
      targetUserDto.id
    );
    let targetProfile: Participant | Mentor = null;
    let [bookDto, participantDto] = await Promise.all([
      this.bookRepository.findByParticipantAndMentorId(this.auth.userId, mentorId),
      this.participantRepository.findByUserId(this.auth.userId),
    ]);
    const mentorUser = User.create(targetUserDto);
    if (!participantDto) {
      targetProfile = Mentor.create(await this.mentorRepository.findByUserId(this.auth.userId));
    } else {
      targetProfile = Participant.create(participantDto);
    }
    const participantUser = this.auth.user;
    let book: Book | undefined = bookDto ? Book.create(bookDto) : undefined;
    if (book) {
      if (book?.isExpired()) {
        this.logger.info("book expired =>", book.expiredDate.toLocaleString());
        book = undefined;
        bookDto = null;
      } else {
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
        participant: participantUser.unmarshall(),
        book: book?.unmarshall() || undefined,
      }).unmarshall();
    }
    const chatSession = ChatSession.create({
      ...chatSessionDto,
      participant: {
        ...chatSessionDto.participant,
        avatarUrl: targetProfile.avatarUrl,
      },
      mentor: {
        ...chatSessionDto.mentor,
        avatarUrl: targetProfileDto.avatarUrl,
      },
    });
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
