import type { IAuth } from "../model/auth";
import type { IRepository } from "./repository";

export interface IAuthRepository extends IRepository<IAuth> {
  privateKey: Buffer;
  publicKey: Buffer;
  findAliveAuth(id: string, token: string): Promise<IAuth|null>;
  destroy(id: string): Promise<void>;
}
