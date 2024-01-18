import { injectable } from "inversify";
import { Repository } from "./repository";
import { IChatSession } from "@/domain/model/chat-session";
import { IChatSessionRepository } from "@/domain/service";

@injectable()
export class ChatSessionRepository
  extends Repository<IChatSession>
  implements IChatSessionRepository
{
  constructor() {
    super("chatSessions");
  }
  async findByUserAndMentorId(
    participantId: string,
    mentorId: string
  ): Promise<IChatSession | null> {
    const chatSessionMongo = await this.collection.findOne({
      "participant.id": participantId,
      "mentor.id": mentorId,
      endAt: {
        $gte: Date.now(),
      },
    });
    if (!chatSessionMongo) return null;
    const { _id, ...chatSession } = chatSessionMongo;
    return <IChatSession>chatSession;
  }
  async findByBookId(bookId: string): Promise<IChatSession | null> {
    const chatSessionMongo = await this.collection.findOne(
      {
        "book.id": bookId,
      },
      {
        sort: {
          endAt: 1,
        },
      }
    );
    if (!chatSessionMongo) return null;
    const { _id, ..._chatSessionMongo } = chatSessionMongo;
    return <IChatSession>_chatSessionMongo;
  }
}
