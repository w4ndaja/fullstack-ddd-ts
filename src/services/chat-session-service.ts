import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { EROLES } from "@/common/utils/roles";
import { Auth, IAuth, IParticipant, Participant, User } from "@/domain/model";
import { Book, IBook } from "@/domain/model/book";
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
  public async startChat(targetEmail: string): Promise<IChatSession> {
    let chatSessionDto: IChatSession | null = null;
    const targetUserDto = await this.userRepository.findByUsernameOrEmail(targetEmail);
    if (!targetUserDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Email not found!");
    }
    const currentUser = this.auth.user;
    const targetUser = User.create(targetUserDto);
    const userIsMentor = currentUser.hasRole(EROLES.MENTOR);
    const targetIsMentor = targetUser.hasRole(EROLES.MENTOR);
    let userProfileDto: IMentor | IParticipant | undefined;
    let targetProfileDto: IMentor | IParticipant | undefined;
    let bookDto: IBook | undefined;
    if (userIsMentor && targetIsMentor) {
      this.logger.info("userIsMentor && targetIsMentor");
      bookDto = await this.bookRepository.findByParticipantAndMentorId(
        currentUser.id,
        targetUser.id
      );
      if (!bookDto) {
        bookDto = await this.bookRepository.findByParticipantAndMentorId(
          targetUser.id,
          currentUser.id
        );
      }
      userProfileDto = await this.mentorRepository.findByUserId(currentUser.id);
      targetProfileDto = await this.mentorRepository.findByUserId(targetUserDto.id);
    } else if (userIsMentor && !targetIsMentor) {
      this.logger.info("userIsMentor && !targetIsMentor");
      bookDto = await this.bookRepository.findByParticipantAndMentorId(
        targetUser.id,
        currentUser.id
      );
      userProfileDto = await this.mentorRepository.findByUserId(currentUser.id);
      targetProfileDto = await this.participantRepository.findByUserId(targetUserDto.id);
    } else if (!userIsMentor && targetIsMentor) {
      this.logger.info("!userIsMentor && targetIsMentor");
      bookDto = await this.bookRepository.findByParticipantAndMentorId(
        currentUser.id,
        targetUser.id
      );
      userProfileDto = await this.participantRepository.findByUserId(currentUser.id);
      targetProfileDto = await this.mentorRepository.findByUserId(targetUserDto.id);
    } else {
      this.logger.info(`userIsMentor=${userIsMentor} && targetIsMentor=${targetIsMentor}`);
    }
    let book: Book | undefined = bookDto ? Book.create(bookDto) : undefined;
    let chatSession: ChatSession;
    if (book?.isExpired() || !book) {
      chatSession = ChatSession.create({
        mentor: {
          ...currentUser.unmarshall(),
          avatarUrl: userProfileDto.avatarUrl,
        },
        participant: {
          ...targetUser.unmarshall(),
          avatarUrl: targetProfileDto.avatarUrl,
        },
      });
    }
    if(!chatSession){
      chatSession = ChatSession.create({
        mentor: {
          ...currentUser.unmarshall(),
          avatarUrl: userProfileDto.avatarUrl,
        },
        participant: {
          ...targetUser.unmarshall(),
          avatarUrl: targetProfileDto.avatarUrl,
        },
      });
    }
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
