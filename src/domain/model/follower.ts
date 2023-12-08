import { Entity, IEntity, IEntityCreate } from "./entity";

export type IFollower = IEntity<{
  followId: string;
  followerId: string;
  followAt: number;
  unfollowAt: number | null;
}>;

export type IFollowerCreate = IEntityCreate<{
  followId: string;
  followerId: string;
  followAt: number;
  unfollowAt?: number | null;
}>;

export class Follower extends Entity<IFollower> {
  constructor(props: IFollowerCreate) {
    super(props);
  }
  public static create(props: IFollowerCreate): Follower {
    return new Follower(props);
  }
  public unmarshall(): IFollower {
    return {
      id: this.id,
      followId: this.followId,
      followerId: this.followerId,
      followAt: this.followAt,
      unfollowAt: this.unfollowAt,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get followId(): string {
    return this._props.followId;
  }
  get followerId(): string {
    return this._props.followerId;
  }
  get followAt(): number {
    return this._props.followAt;
  }
  get unfollowAt(): number | null {
    return this._props.unfollowAt || null;
  }
  set followId(value: string) {
    this._props.followId = value;
  }
  set followerId(value: string) {
    this._props.followerId = value;
  }
  set followAt(value: number) {
    this._props.followAt = value;
  }
  set unfollowAt(value: number | null) {
    this._props.unfollowAt = value;
  }
}
