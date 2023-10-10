import { IUser } from "@/domain/model";
import { IUserRepository } from "@/domain/service";
import { injectable } from "inversify";
import { Repository } from "./repository";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";

@injectable()
export class UserRepository extends Repository<IUser> implements IUserRepository {
  constructor() {
    super("users");
  }

  async findByUsername(username: string): Promise<IUser> {
    const collection = await this.collection.findOne({ username });
    if (!collection) {
      throw new AppError(ErrorCode.NOT_FOUND, `User with username:${username} not found!`);
    }
    const { _id, ...data } = collection;
    return <IUser>data;
  }
}
