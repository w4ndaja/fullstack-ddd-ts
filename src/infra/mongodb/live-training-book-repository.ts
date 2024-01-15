import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { ILiveTrainingBook, LiveTrainingBook } from "@/domain/model/live-training-book";
import { ILiveTrainingBookRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";
import {
  GenericPaginatedData,
  IGenericPaginatedData,
  PaginationLib,
} from "@/common/libs/pagination";

@injectable()
export class LiveTrainingBookRepository
  extends Repository<ILiveTrainingBook>
  implements ILiveTrainingBookRepository
{
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("liveTrainingBooks");
  }
  async findHistoryByMonthStatusAndUserId(
    startDate: number,
    endDate: number,
    userId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<IGenericPaginatedData<ILiveTrainingBook>> {
    const skip = PaginationLib.calcSkip(page, limit);
    const liveTrainingDto = (
      await this.collection
        .aggregate([
          {
            $lookup: {
              from: "liveTrainings",
              localField: "liveTrainingId",
              foreignField: "id",
              as: "liveTraining",
            },
          },
          {
            $match: {
              "liveTraining.startAt": {
                $gte: startDate,
                $lte: endDate,
              },
              "liveTraining.status": status,
              "participants.userId": userId,
            },
          },
          {
            $limit: limit,
          },
          {
            $skip: skip,
          },
        ])
        .toArray()
    ).map(({ _id, ...item }) =>
      LiveTrainingBook.create(<ILiveTrainingBook>{
        ...item,
        liveTraining: item.liveTraining?.[0] || undefined,
      }).unmarshall()
    );
    const _liveTrainingCount = await this.collection.aggregate([
      {
        $lookup: {
          from: "liveTrainings",
          localField: "liveTrainingId",
          foreignField: "id",
          as: "liveTraining",
        },
      },
      {
        $match: {
          "liveTraining.startAt": {
            $gte: startDate,
            $lte: endDate,
          },
          "liveTraining.status": status,
          "participants.userId": userId,
        },
      },
      {
        $count: "count",
      },
    ]);
    const [{ count }] = await _liveTrainingCount.toArray();
    const liveTrainingPaginated = GenericPaginatedData.create({
      page: page,
      limit: limit,
      data: liveTrainingDto,
      totalRow: count,
    }).unmarshall();
    return liveTrainingPaginated;
  }
  async findByIdAndParticipantId(id: string, participantId: string): Promise<ILiveTrainingBook> {
    const liveTrainingBook = await this.collection.findOne({
      liveTrainingId: id,
      "participants.userId": participantId,
    });
    if (!liveTrainingBook) {
      return null;
    }
    const { _id, ...data } = liveTrainingBook;
    return <ILiveTrainingBook>data;
  }
}
