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
import { LiveTraining } from "@/domain/model/live-training";

@injectable()
export class LiveTrainingBookRepository
  extends Repository<ILiveTrainingBook>
  implements ILiveTrainingBookRepository
{
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("liveTrainingBooks");
  }
  async calculateIncome(liveTrainingId: string): Promise<number> {
    const [{ paymentTotal }] = await this.collection
      .aggregate([
        {
          $match: {
            liveTrainingId: liveTrainingId,
          },
        },
        {
          $group: {
            _id: 1,
            paymentTotal: { $sum: "$payment.total" },
          },
        },
      ])
      .toArray();
    return paymentTotal;
  }
  async findHistoryByMonthStatusAndUserId(
    startDate: number | undefined,
    endDate: number | undefined,
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
              ...(startDate && endDate
                ? {
                    "liveTraining.startAt": {
                      $gte: startDate,
                      $lte: endDate,
                    },
                  }
                : {}),
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
    ).map(
      ({ _id, ...item }) =>
        <ILiveTrainingBook>{
          ...item,
          liveTraining: item.liveTraining?.[0] || undefined,
        }
    );
    this.logger.info(liveTrainingDto);
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
    const [{ count = 0 } = { count: 0 }] = await _liveTrainingCount.toArray();
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

  async findById(id: string): Promise<ILiveTrainingBook> {
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
              id: id,
            },
          },
        ])
        .toArray()
    ).map(({ _id, ...item }) => {
      let liveTrainingDto = item.liveTraining?.[0] || undefined;
      const liveTraining = liveTrainingDto
        ? LiveTraining.create(liveTrainingDto).unmarshall()
        : undefined;
      const liveTrainingBookDto = LiveTrainingBook.create(<ILiveTrainingBook>{
        ...item,
        liveTraining,
      }).unmarshall();
      return liveTrainingBookDto;
    });
    return liveTrainingDto[0];
  }
}
