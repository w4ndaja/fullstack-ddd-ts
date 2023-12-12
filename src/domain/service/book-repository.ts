import { IBook } from "../model/book";
import { IRepository } from "./repository";

export interface IBookRepository extends IRepository<IBook> {
  getByParticipantId(participantId: string, status: string): Promise<IBook[]>;
  getByMentorId(mentorId: string, status: string): Promise<IBook[]>;
}
