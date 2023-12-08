import { Entity, IEntity, IEntityCreate } from "./entity";

export type IBlock = IEntity<{
  userId: string;
  blockedBy: string;
  reason: string;
  pictureUrl: string;
  unBlockedAt: number | null;
}>;

export type IBlockCreate = IEntityCreate<{
  userId: string;
  blockedBy: string;
  reason: string;
  pictureUrl: string;
  unBlockedAt?: number | null;
}>;

export class Block extends Entity<IBlock> {
  constructor(props: IBlockCreate) {
    super(props);
  }
  public static create(props: IBlockCreate): Block {
    return new Block(props);
  }
  public unmarshall(): IBlock {
    return {
      id: this.id,
      userId: this.userId,
      blockedBy: this.blockedBy,
      reason: this.reason,
      pictureUrl: this.pictureUrl,
      unBlockedAt: this.unBlockedAt,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get userId(): string {
    return this._props.userId;
  }
  get blockedBy(): string {
    return this._props.blockedBy;
  }
  get reason(): string {
    return this._props.reason;
  }
  get pictureUrl(): string {
    return this._props.pictureUrl;
  }
  get unBlockedAt(): number | null {
    return this._props.unBlockedAt || null;
  }

  set userId(value: string) {
    this._props.userId = value;
  }

  set blockedBy(value: string) {
    this._props.blockedBy = value;
  }

  set reason(value: string) {
    this._props.reason = value;
  }

  set pictureUrl(value: string) {
    this._props.pictureUrl = value;
  }

  set unBlockedAt(value: number | null) {
    this._props.unBlockedAt = value;
  }
}
