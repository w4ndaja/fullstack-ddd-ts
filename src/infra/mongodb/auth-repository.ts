import { IAuth } from "@/domain/model/auth";
import { IAuthRepository } from "@/domain/service/auth-repository";
import { Repository } from "./repository";
import { config } from "@/common/utils/config";
import { injectable } from "inversify";
import fs from "fs";

@injectable()
export class AuthRepository extends Repository<IAuth> implements IAuthRepository {
  privateKey: Buffer;
  publicKey: Buffer;
  constructor() {
    super("auths");
    this.privateKey = fs.readFileSync(config.app.privateKey);
    this.publicKey = fs.readFileSync(config.app.publicKey);
  }
  async findAliveAuth(id: string, token: string): Promise<IAuth | null> {
    const collection = await this.collection.findOne({
      id,
      token,
    });
    if (!collection) {
      return null;
    }
    const { _id, ...data } = collection;
    return <IAuth>data;
  }
  async destroy(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }
}
