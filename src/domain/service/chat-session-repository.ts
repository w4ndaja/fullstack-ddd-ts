import { IChatSession } from "../model/chat-session";
import { IRepository } from "./repository";

export interface IChatSessionRepository extends IRepository<IChatSession> {
  findByBookId(bookId: string): Promise<IChatSession | null>;
  findByUserAndMentorId(participantId:string, mentorId: string): Promise<IChatSession | null>;
}
