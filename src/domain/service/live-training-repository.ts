import {
  IBaseGetParam,
  ICreateGenericPaginatedData,
  IGenericPaginatedData,
} from "@/common/libs/pagination";
import { ILiveTraining, ILiveTrainingStatus } from "../model/live-training";
import { IRepository } from "./repository";
import { EBookStatus } from "@/common/utils/book-status";

export interface ILiveTrainingRepository extends IRepository<ILiveTraining> {
  findActiveByMentorId(mentorId: string): Promise<ILiveTraining | null>;
  findAllByStatus(
    param: IBaseGetParam,
    status: ILiveTrainingStatus
  ): Promise<ICreateGenericPaginatedData<ILiveTraining>>;
  findActiveByRoomAndMentorId(roomId: string, mentorId: string): Promise<ILiveTraining>;
}
