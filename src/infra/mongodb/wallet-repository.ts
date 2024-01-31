import { injectable } from "inversify";
import { Repository } from "./repository";
import { IWallet, Wallet } from "@/domain/model/wallet";
import { IWalletRepository } from "@/domain/service";

@injectable()
export class WalletRepository extends Repository<IWallet> implements IWalletRepository {
  constructor() {
    super("wallets");
  }

  async findByUserId(userId: string): Promise<IWallet> {
    const collection = await this.collection.findOne({ userId: userId });
    if (collection) {
      const { _id, ...data } = collection;
      return <IWallet>data;
    } else {
      const data = await this.save(
        Wallet.create({
          userId: userId,
          balance: 0,
          payoutTotal: 0,
          incomeTotal: 0,
        }).unmarshall()
      );
      return <IWallet>data;
    }
  }

  async save(data: Partial<IWallet>): Promise<IWallet> {
    const checkExist = await this.collection.findOne({ userId: data.userId });
    if (checkExist?._id) {
      await this.collection.updateOne(
        { id: data.id },
        {
          $set: data,
        }
      );
    } else {
      await this.collection.insertOne(data);
    }
    const { _id, ...__data } = <any>data;
    return <IWallet>__data;
  }
}
