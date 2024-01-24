import { IBook } from "../model/book";
import { IRepository } from "./repository";

export interface IBookRepository extends IRepository<IBook> {
  findAllByParticipantId(participantId: string, status: string): Promise<IBook[]>;
  findAllByMentorId(mentorId: string, status: string): Promise<IBook[]>;
  findByParticipantAndMentorId(participantId: string, mentorId:string): Promise<IBook | null>;
  findByOrderId(orderId:string):Promise<IBook>
}
