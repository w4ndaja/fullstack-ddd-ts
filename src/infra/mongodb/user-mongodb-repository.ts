import { injectable } from "inversify";
import { IBaseGetParam, IGenericPaginatedData } from "../../common/utils";
import { User } from "../../domain/model";
import { UserRepository } from "../../domain/service";

@injectable()
export class UserMongodbRepository implements UserRepository {
  findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<User>> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<User> {
    return User.create({ name: "asuasd" });
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
