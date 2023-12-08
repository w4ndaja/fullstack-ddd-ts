import { Entity, IEntity, IEntityCreate } from "./entity";

export type IWithdraw = IEntity<{
  userId: string;
  status: string;
  receivedAt: number;
}>;

export type IWithdrawCreate = IEntityCreate<{
  userId: string;
  status: string;
  receivedAt: number;
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
      id: this.id,
      userId: this.userId,
      status: this.status,
      receivedAt: this.receivedAt,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get userId(): string {
    return this._props.userId;
  }
  get status(): string {
    return this._props.status;
  }
  get receivedAt(): number {
    return this._props.receivedAt;
  }
  set userId(value: string) {
    this._props.userId = value;
  }
  set status(value: string) {
    this._props.status = value;
  }
  set receivedAt(value: number) {
    this._props.receivedAt = value;
  }
}
