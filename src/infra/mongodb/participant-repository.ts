import { IParticipant } from "@/domain/model";
import { Repository } from "./repository";
import { IParticipantRepository } from "@/domain/service/participant-repository";
import { injectable } from "inversify";

@injectable()
export class ParticipantRepository
  extends Repository<IParticipant>
  implements IParticipantRepository
{
  constructor() {
    super("participants");
  }
  async findByUserId(userId: string): Promise<IParticipant | null> {
    const collection = await this.collection.findOne({ userId });
    if (!collection) {
      return null;
    }
    const { _id, ...data } = collection;
    return <IParticipant>data;
  }
}
