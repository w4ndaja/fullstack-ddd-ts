import { IGenericPaginatedData } from "@/common/libs/pagination";
import { ILiveTrainingBook } from "../model/live-training-book";
import { IRepository } from "./repository";

export interface ILiveTrainingBookRepository extends IRepository<ILiveTrainingBook> {
  findByIdAndParticipantId(id: string, participantId: string): Promise<ILiveTrainingBook>;
  findHistoryByMonthStatusAndUserId(
    startDate: number | undefined,
    endDate: number | undefined,
    userId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<IGenericPaginatedData<ILiveTrainingBook>>;
}
