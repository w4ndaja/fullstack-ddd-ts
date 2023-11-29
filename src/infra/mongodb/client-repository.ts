import { injectable } from "inversify";
import { Repository } from "./repository";
import { IClient } from "@/domain/model";
import { IClientRepository } from "@/domain/service";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

@injectable()
export class ClientRepository extends Repository<IClient> implements IClientRepository {
  constructor() {
    super("clients");
  }
  async findByUserId(userId: string): Promise<IClient> {
    const collection = await this.collection.findOne({
      userId,
    });
    if (!collection) {
      throw new AppError(ErrorCode.NOT_FOUND, `Client with userId: ${userId} not found!`);
    }
    const { _id, ...data } = collection;
    return <IClient>data;
  }
}
