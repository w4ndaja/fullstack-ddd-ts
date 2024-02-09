import { IUser } from "@/domain/model/user";
import { IUserRepository } from "@/domain/service/user-repository";
import { injectable } from "inversify";
import { Repository } from "./repository";

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
