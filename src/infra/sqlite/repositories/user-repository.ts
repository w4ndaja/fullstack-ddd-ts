import { IUser } from "@/domain/model/user";
import { IUserRepository } from "@/domain/service/user-repository";
import { injectable } from "inversify";
import { User as UserSqlite } from "../models";
import { Repository } from "./repository";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";

@injectable()
export class UserRepository extends Repository<IUser> implements IUserRepository {
  constructor() {
    super(UserSqlite);
  }
  async findByUsernameOrEmail(username: string): Promise<IUser> {
    await this.datasource.waitUntilInitialized;
    const sqliteResult = await this.repository.findOneBy({
      username,
    });
    if (!sqliteResult) throw new AppError(ErrorCode.NOT_FOUND, `User with username:${username} not found!`);
    return <IUser>sqliteResult;
  }
}
