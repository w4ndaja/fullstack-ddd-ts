import { ILiveTrainingRepository } from "@/domain/service";
import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { ILiveTraining, ILiveTrainingStatus, LiveTraining } from "@/domain/model/live-training";
import {
  GenericPaginatedData,
  IBaseGetParam,
  ICreateGenericPaginatedData,
  IGenericPaginatedData,
  PaginationLib,
} from "@/common/libs/pagination";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";
import { arrayMapper } from "@/common/libs/array-mapper";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

@injectable()
export class LiveTrainingRepository
  extends Repository<ILiveTraining>
  implements ILiveTrainingRepository
{
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("liveTrainings");
  }
  async findHistoryByMonthStatusAndMentorId(
    startDate: number,
    endDate: number,
    mentorId: string,
    page: number,
    limit: number,
    status: string | undefined
  ): Promise<IGenericPaginatedData<ILiveTraining>> {
    const skip = PaginationLib.calcSkip(page, limit);
    const liveTraining = await this.collection.find(
      {
        startAt: {
          $gte: startDate,
          $lte: endDate,
        },
        ...(status && { status: status }),
        mentorId: mentorId,
      },
      {
        limit,
        skip,
      }
    );
    const liveTrainingCount = await this.collection.countDocuments({
      startAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: status,
      mentorId: mentorId,
    });
    const liveTrainingsDto = (await liveTraining.toArray()).map(({ _id, ...item }) =>
      LiveTraining.create(<ILiveTraining>item).unmarshall()
    );
    return GenericPaginatedData.create({
      page: page,
      limit: limit,
      data: liveTrainingsDto,
      totalRow: liveTrainingCount,
    }).unmarshall();
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
          ...(status !== "ONGOINGCOMINGSOON" && { status: status.toString() }),
          ...(status == "ONGOINGCOMINGSOON" && {
            status: {
              $in: ["ONGOING", "COMINGSOON"],
            },
          }),
          authorized: true,
        },
        {
          limit: param.limit,
          skip,
          sort : {
            startAt : 1,
          }
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
