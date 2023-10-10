import type { IRepository } from "./repository";
import { IUser } from "@/domain/model";

export interface IUserRepository extends IRepository<IUser> {
  // TODO: add other method here for other result than basic CRUD
  findByUsername(username: string): Promise<IUser>;
}
