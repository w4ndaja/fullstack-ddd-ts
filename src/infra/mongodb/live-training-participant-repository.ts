import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { ILiveTrainingBook } from "@/domain/model/live-training-book";
import { ILiveTrainingBookRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";

@injectable()
export class LiveTrainingBookRepository
  extends Repository<ILiveTrainingBook>
  implements ILiveTrainingBookRepository
{
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("liveTrainingBooks");
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
