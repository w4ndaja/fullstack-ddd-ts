import { injectable } from "inversify";
import { ICreateUser, IUser, User } from "../../domain/model/user";
import { UserRepository } from "../../domain/service/user-repository";
import { IBaseGetParam, IGenericPaginatedData } from "../../common/utils";

@injectable()
export class UserSqliteRepository implements UserRepository {
  findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<User>> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<User> {
    return User.create({ name: "mengapa ..." });
  }
  store(param: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(param: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  destroy(param: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
