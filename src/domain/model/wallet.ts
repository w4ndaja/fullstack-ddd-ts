import { AppError } from "@/common/libs/error-handler";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { ErrorCode } from "@/common/utils";

export type IWallet = IEntity<{
  userId: string;
  balance: number;
  payoutTotal: number;
  incomeTotal: number;
}>;
export type IWalletCreate = IEntityCreate<{
  userId: string;
  balance: number;
  payoutTotal: number;
  incomeTotal: number;
}>;
export class Wallet extends Entity<IWallet> {
  constructor(props: IWalletCreate) {
    super(props);
  }
  public static create(props: IWalletCreate) {
    return new Wallet(props);
  }
  public unmarshall(): IWallet {
    return {
      ...super.unmarshall(),
      userId: this.userId,
      balance: this.balance,
      payoutTotal: this.payoutTotal,
      incomeTotal: this.incomeTotal,
    };
  }
  public addIncome(income: number) {
    this.balance += income;
    this.incomeTotal += income;
    return this;
  }
  public withdraw(amount: number) {
    if (this.balance < amount) {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Insufficient Balance");
    }
    this.balance -= amount;
    this.payoutTotal += amount;
    return this;
  }
  public refund(amount: number) {
    this.balance += amount;
    this.payoutTotal -= amount;
    return this;
  }
  get userId(): string {
    return this._props.userId;
  }
  set userId(v: string) {
    this._props.userId = v;
  }
  get balance(): number {
    return this._props.balance;
  }
  set balance(v: number) {
    this._props.balance = v;
  }
  get payoutTotal(): number {
    return this._props.payoutTotal;
  }
  set payoutTotal(v: number) {
    this._props.payoutTotal = v;
  }
  get incomeTotal(): number {
    return this._props.incomeTotal;
  }
  set incomeTotal(v: number) {
    this._props.incomeTotal = v;
  }
}
