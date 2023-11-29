import { Entity, IEntity, IEntityCreate } from "./entity";
import { IUser, User } from "./user";

export type IIntroVideo = {
  url: string;
  provider: string;
};

export type IClient = IEntity<{
  username: string;
  fullname: string;
  hasUnreadNotification: boolean;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  bio: string;
  gender: string;
  introVideoUrl: IIntroVideo;
  user?: IUser;
  userId: IUser["id"];
}>;

export type IClientCreate = IEntityCreate<{
  username: string;
  fullname: string;
  hasUnreadNotification?: boolean;
  avatarUrl?: string;
  followerCount?: number;
  followingCount?: number;
  bio: string;
  gender: string;
  introVideoUrl?: IIntroVideo;
  user?: IUser;
  userId: IUser["id"];
}>;

export class Client extends Entity<IClient> {
  constructor(props: IClientCreate) {
    super(props);
  }
  public static create(props: IClientCreate): Client {
    return new Client(props);
  }
  public unmarshall(): IClient {
    return {
      id: this.id,
      username: this.username,
      fullname: this.fullname,
      hasUnreadNotification: this.hasUnreadNotification,
      avatarUrl: this.avatarUrl,
      followerCount: this.followerCount,
      followingCount: this.followingCount,
      bio: this.bio,
      introVideoUrl: this.introVideoUrl,
      user: this.user?.unmarshall(),
      userId: this.userId,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }

  get username(): string {
    return this._props.username;
  }
  get fullname(): string {
    return this._props.fullname;
  }
  get hasUnreadNotification(): boolean {
    return this._props.hasUnreadNotification;
  }
  get avatarUrl(): string {
    return this._props.avatarUrl;
  }
  get followerCount(): number {
    return this._props.followerCount;
  }
  get followingCount(): number {
    return this._props.followingCount;
  }
  get bio(): string {
    return this._props.bio;
  }
  get introVideoUrl(): IIntroVideo {
    return this._props.introVideoUrl;
  }
  get user(): User | undefined {
    if (this._props.user instanceof User) {
      return this._props.user;
    }
    return this._props.user ? User.create(this._props.user) : undefined;
  }
  get userId(): IUser["id"] {
    return this._props.userId;
  }
}
