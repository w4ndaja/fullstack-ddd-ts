import { IParticipant } from "../model";
import { IRepository } from "./repository";

export interface IParticipantRepository extends IRepository<IParticipant> {
  findByUserId(userId: string): Promise<IParticipant | null>;
}
