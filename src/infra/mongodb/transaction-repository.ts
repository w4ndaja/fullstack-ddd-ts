import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { ITransaction, ITransactionCreate } from "@/domain/model/transaction";
import { ITransactionRepository } from "@/domain/service/transaction-repository";
import { Midtrans } from "../midtrans";

@injectable()
export class TransactionRepository
  extends Repository<ITransaction>
  implements ITransactionRepository
{
  constructor(@inject(Midtrans) private midtrans: Midtrans) {
    super("transactions");
  }
  async findByOrderId(orderId: string): Promise<ITransaction | null> {
    const mongoResult = await this.collection.findOne({ "transaction_details.order_id": orderId });
    if (!mongoResult) return null;
    const { _id, ...result } = mongoResult;
    return <ITransaction>result;
  }
  async createTransaction(transaction: ITransactionCreate): Promise<ITransaction> {
    const transactionMidtrans = await this.midtrans.createTransaction(transaction);
    await this.collection.insertOne(transactionMidtrans);
    const { _id, ...transactionMongo } = <any>transactionMidtrans;
    return transactionMongo;
  }
}
