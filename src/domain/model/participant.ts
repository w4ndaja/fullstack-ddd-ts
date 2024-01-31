import { Entity, IEntity, IEntityCreate } from "./entity";
import { IUser, User } from "./user";

export type IParticipant = IEntity<{
  userId: IUser["id"];
  username: string;
  email: string;
  followerCount: number;
  followingCount: number;
  fullname: string;
  bio: string;
  gender: string;
  avatarUrl: string;
  introVideo: {
    service: string;
    url: string;
  };
  hasUnreadNotif: boolean;
  balance: number;
  user?: IUser;
}>;

export type IParticipantCreate = IEntityCreate<{
  userId: IUser["id"];
  username: string;
  email?: string;
  followerCount?: number;
  followingCount?: number;
  fullname: string;
  bio: string;
  gender: string;
  avatarUrl?: string;
  introVideo?: {
    service: string;
    url: string;
  };
  hasUnreadNotif?: boolean;
  balance?: number;
  user?: IUser;
}>;

export class Participant extends Entity<IParticipant> {
  constructor(props: IParticipantCreate) {
    super(props);
  }
  public static create(props: IParticipantCreate): Participant {
    return new Participant(props);
  }
  public unmarshall(): IParticipant {
    return {
      id: this.id,
      userId: this.userId,
      username: this.username,
      email: this.email,
      followerCount: this.followerCount,
      followingCount: this.followingCount,
      fullname: this.fullname,
      bio: this.bio,
      gender: this.gender,
      avatarUrl: this.avatarUrl,
      introVideo: this.introVideo,
      hasUnreadNotif: this.hasUnreadNotification,
      balance: this.balance,
      user: this.user?.unmarshall(),
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
    return this._props.hasUnreadNotif;
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
  get introVideo(): { service: string; url: string } {
    return this._props.introVideo;
  }
  get gender(): string {
    return this._props.gender;
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
  get balance(): number {
    return this._props.balance;
  }
  get email(): string {
    return this._props.email || "";
  }
  set email(v: string) {
    this._props.email = v;
  }
}
