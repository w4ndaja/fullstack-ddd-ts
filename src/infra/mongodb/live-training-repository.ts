import { ILiveTrainingRepository } from "@/domain/service";
import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { ILiveTraining, ILiveTrainingStatus } from "@/domain/model/live-training";
import {
  IBaseGetParam,
  ICreateGenericPaginatedData,
  PaginationLib,
} from "@/common/libs/pagination";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";

@injectable()
export class LiveTrainingRepository
  extends Repository<ILiveTraining>
  implements ILiveTrainingRepository
{
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("liveTrainings");
  }
  async findActiveByRoomAndMentorId(
    roomId: string,
    mentorId: string
  ): Promise<ILiveTraining | null> {
    const liveTrainingMongo = await this.collection.findOne({
      roomId,
      mentorId,
      startAt: {
        $lte: Date.now(),
      },
    });
    if (!liveTrainingMongo) {
      return null;
    }
    const { _id, ..._liveTrainingMongo } = liveTrainingMongo;
    return <ILiveTraining>_liveTrainingMongo;
  }
  async findAllByStatus(
    param: IBaseGetParam,
    status: ILiveTrainingStatus
  ): Promise<ICreateGenericPaginatedData<ILiveTraining>> {
    const skip = PaginationLib.calcSkip(param.page, param.limit);
    const liveTrainingDto = await this.collection
      .find(
        {
          status: status.toString(),
          authorized: true,
        },
        {
          limit: param.limit,
          skip,
        }
      )
      .toArray();
    const genericPaginatedData: ICreateGenericPaginatedData<ILiveTraining> = {
      page: param.page,
      limit: param.limit,
      data: <ILiveTraining[]>liveTrainingDto.map(({ _id, ...item }) => <ILiveTraining>item),
      totalRow: await this.collection.countDocuments(),
    };
    return genericPaginatedData;
  }
  async findActiveByMentorId(mentorId: string): Promise<ILiveTraining | null> {
    const liveTrainingDto = await this.collection.findOne({
      mentorId: mentorId,
      status: <ILiveTrainingStatus>"ONGOING",
    });
    if (!liveTrainingDto) {
      return null;
    }
    const { _id, ..._liveTrainingDto } = liveTrainingDto;
    return <ILiveTraining>_liveTrainingDto;
  }
}
