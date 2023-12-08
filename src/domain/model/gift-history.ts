import { Entity, IEntity, IEntityCreate } from "./entity";

export type IGiftHistory = IEntity<{
  liveTrainingId: string;
  senderId: string;
  receiverId: string;
  name: string;
  amount: number;
}>;

export type IGiftHistoryCreate = IEntityCreate<{
  liveTrainingId: string;
  senderId: string;
  receiverId: string;
  name: string;
  amount: number;
}>;

export class GiftHistory extends Entity<IGiftHistory>{
  constructor(props: IGiftHistoryCreate) {
    super(props);
  }
  public static create(props: IGiftHistoryCreate): GiftHistory {
    return new GiftHistory(props);
  }
  public unmarshall(): IGiftHistory {
    return {
      id: this.id,
      liveTrainingId: this.liveTrainingId,
      senderId: this.senderId,
      receiverId: this.receiverId,
      name: this.name,
      amount: this.amount,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get liveTrainingId(): string {
    return this._props.liveTrainingId;
  }
  get senderId(): string {
    return this._props.senderId;
  }
  get receiverId(): string {
    return this._props.receiverId;
  }
  get name(): string {
    return this._props.name;
  }
  get amount(): number {
    return this._props.amount;
  }
  set liveTrainingId(value: string) {
    this._props.liveTrainingId = value;
  }
  set senderId(value: string) {
    this._props.senderId = value;
  }
  set receiverId(value: string) {
    this._props.receiverId = value;
  }
  set name(value: string) {
    this._props.name = value;
  }
  set amount(value: number) {
    this._props.amount = value;
  }
}
