import { EWithdrawStatus } from "@/common/utils/withdraw-status";
import { Entity, IEntity, IEntityCreate } from "./entity";

export type IWithdraw = IEntity<{
  userId: string;
  amount: number;
  status: string;
  receivedAt: number | null;
}>;

export type IWithdrawCreate = IEntityCreate<{
  userId: string;
  amount: number;
  status: string;
  receivedAt?: number | null;
}>;

export class Withdraw extends Entity<IWithdraw> {
  constructor(props: IWithdrawCreate) {
    super(props);
  }
  public static create(props: IWithdrawCreate): Withdraw {
    return new Withdraw(props);
  }
  public unmarshall(): IWithdraw {
    return {
      ...super.unmarshall(),
      status: this.status.toString(),
    };
  }
  get userId(): string {
    return this._props.userId;
  }
  get status(): EWithdrawStatus {
    return <EWithdrawStatus>(<unknown>this._props.status);
  }
  get receivedAt(): number | null {
    return this._props.receivedAt || null;
  }
  set userId(value: string) {
    this._props.userId = value;
  }
  set status(value: EWithdrawStatus) {
    this._props.status = value.toString();
  }
  set receivedAt(value: number) {
    this._props.receivedAt = value;
  }
  get amount(): number {
    return this._props.amount;
  }
  set amount(v: number) {
    this._props.amount = v;
  }
}
