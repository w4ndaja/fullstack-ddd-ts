import { injectable } from "inversify";
import { Repository } from "./repository";
import fs from "fs";
import { IAuth } from "@/domain/model/auth";
import { IAuthRepository } from "@/domain/service/auth-repository";
import { Auth as AuthSqlite } from "../models";
import { ErrorCode, config } from "@/common/utils";
import { AppError } from "@/common/libs/error-handler";

@injectable()
export class AuthRepository extends Repository<IAuth> implements IAuthRepository {
  privateKey: Buffer;
  publicKey: Buffer;
  constructor() {
    super(AuthSqlite);
    this.privateKey = Buffer.from(fs.readFileSync(config.app.privateKey));
    this.publicKey = Buffer.from(fs.readFileSync(config.app.publicKey));
  }
  async findAliveAuth(id: string, token: string): Promise<IAuth> {
    const authSqlite = await this.repository.findOne({
      where: { id, token, expired: false },
      relations: {
        user: true,
      },
    });
    if (!authSqlite) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized!");
    const auth = <IAuth>authSqlite;
    if (auth.expired) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized!");
    return auth;
  }
  async destroy(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
