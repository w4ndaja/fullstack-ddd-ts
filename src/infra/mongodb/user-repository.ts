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

  async findByUsernameOrEmail(username: string): Promise<IUser|null> {
    const collection = await this.collection.findOne({
      $or: [
        {
          username: username,
        },
        {
          email: username,
        },
      ],
    });
    if (!collection) {
      return null
    }
    const { _id, ...data } = collection;
    return <IUser>data;
  }
}
