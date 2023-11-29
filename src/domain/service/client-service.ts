import { IClient } from "../model/client";
import { IRepository } from "./repository";

export interface IClientRepository extends IRepository<IClient> {
  findByUserId(userId: string): Promise<IClient>;
}
