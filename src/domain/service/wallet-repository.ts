import { IWallet } from "../model/wallet";
import { IRepository } from "./repository";

export interface IWalletRepository extends IRepository<IWallet> {
  findByUserId(userId: string): Promise<IWallet>;
}
