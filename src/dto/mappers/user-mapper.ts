import { User } from "@/domain/model/user";
import { object } from "zod";

export class UserMapper {
  public static domainToSqliteModel(user: User): unknown {
    return {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
      deletedAt: user.deletedAt?.getTime() || 0,
    };
  }
}
