import { ILiveTrainingBook } from "../model/live-training-book";
import { IRepository } from "./repository";

export interface ILiveTrainingBookRepository extends IRepository<ILiveTrainingBook> {
  findByIdAndParticipantId(id: string, participantId: string): Promise<ILiveTrainingBook>;
}
