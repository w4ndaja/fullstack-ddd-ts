import { config } from "@/common/utils";
import { ITransaction, ITransactionCreate, Transaction } from "@/domain/model/transaction";
import axios, { Axios } from "axios";
import { injectable } from "inversify";
import { Snap } from "midtrans-client";

@injectable()
export class Midtrans {
  private snap: Snap;
  private env: "PRODUCTION" | "SANDBOX";
  private authString: string;
  public serverKey: string;
  constructor() {
    this.env = <"PRODUCTION" | "SANDBOX">config.midtrans.env;
    this.serverKey =
      this.env == "PRODUCTION"
        ? config.midtrans.serverKeyProduction
        : config.midtrans.serverKeySandbox;
    this.authString = Buffer.from(`${this.serverKey}:`, "base64").toString();
    this.snap = new Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: this.env == "PRODUCTION",
      serverKey:
        this.env === "PRODUCTION"
          ? config.midtrans.serverKeyProduction
          : config.midtrans.serverKeySandbox,
    });
  }
  public async createTransaction(transaction: ITransactionCreate): Promise<ITransaction> {
    const result = await this.snap.createTransaction(transaction);
    return <ITransaction>{
      ...transaction,
      token: result.token,
      redirect_url: result.redirect_url,
    };
  }
}
