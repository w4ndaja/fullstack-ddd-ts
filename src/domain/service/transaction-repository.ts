import { ITransaction, ITransactionCreate } from "../model/transaction";
import { IRepository } from "./repository";

export interface ITransactionRepository extends IRepository<ITransaction> {
  createTransaction(transaction: ITransactionCreate): Promise<ITransaction>;
  findByOrderId(orderId: string): Promise<ITransaction | null>;
}
