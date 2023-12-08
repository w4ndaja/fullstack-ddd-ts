import { Entity, IEntity, IEntityCreate } from "./entity";

export type ILiveTrainingParticipant = IEntity<{
  liveTrainingId: string;
  userId: string;
  role: string;
  leaveAt: number;
}>;

export type ILiveTrainingParticipantCreate = IEntityCreate<{
  liveTrainingId: string;
  userId: string;
  role: string;
  leaveAt: number;
}>;

export class LiveTrainingParticipant extends Entity<ILiveTrainingParticipant> {
  constructor(props: ILiveTrainingParticipantCreate) {
    super(props);
  }
  public static create(props: ILiveTrainingParticipantCreate): LiveTrainingParticipant {
    return new LiveTrainingParticipant(props);
  }
  public unmarshall(): ILiveTrainingParticipant {
    return {
      id: this.id,
      liveTrainingId: this.liveTrainingId,
      userId: this.userId,
      role: this.role,
      leaveAt: this.leaveAt,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get liveTrainingId(): string {
    return this._props.liveTrainingId;
  }
  get userId(): string {
    return this._props.userId;
  }
  get role(): string {
    return this._props.role;
  }
  get leaveAt(): number {
    return this._props.leaveAt;
  }
  set liveTrainingId(value: string) {
    this._props.liveTrainingId = value;
  }
  set userId(value: string) {
    this._props.userId = value;
  }
  set role(value: string) {
    this._props.role = value;
  }
  set leaveAt(value: number) {
    this._props.leaveAt = value;
  }
}
