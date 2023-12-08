import { AppError } from "@/common/libs/error-handler";
import { Entity, IEntityCreate, IEntity } from "./entity";
import { IUser, User } from "./user";
import { ErrorCode } from "@/common/utils/error-code";

export type IAuth = IEntity<{
  userId: string;
  expiredAt: number | null;
  expired: boolean;
  lastLoginAt: number;
  user: IUser;
  token?: string;
}>;

export type IAuthCreate = IEntityCreate<{
  userId: string;
  expiredAt?: number | null;
  expired: boolean;
  lastLoginAt?: number | null;
  user?: IUser;
  token?: string;
}>;

export class Auth extends Entity<IAuth> {
  constructor({ expired, user, lastLoginAt, ...props }: IAuthCreate) {
    if (!user) {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "User is Required");
    }
    super({ ...props, user, expired: !!expired, lastLoginAt: Date.now() });
  }
  public static create(props: IAuthCreate): Auth {
    return new Auth(props);
  }
  public unmarshall(): IAuth {
    return {
      id: this.id,
      userId: this.userId,
      expiredAt: this.expiredAt,
      expired: this.expired,
      lastLoginAt: this.lastLoginAt,
      user: this.user.unmarshall(),
      token: this.token,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get userId(): string {
    return this._props.userId;
  }
  get expiredAt(): number | null {
    return this._props.expiredAt || null;
  }
  get expired(): boolean {
    return (
      this._props.expired || (this._props.expiredAt ? Date.now() > this._props.expiredAt : false)
    );
  }
  get lastLoginAt(): number {
    return this._props.lastLoginAt;
  }
  get user(): User {
    if (this._props.user instanceof User) {
      return this._props.user;
    }
    return User.create(this._props.user);
  }
  get token(): string {
    if (!this._props.token) {
      throw new AppError(ErrorCode.NOT_IMPLEMENTED, "Token is empty");
    }
    return this._props.token;
  }
  set token(token: string) {
    this._props.token = token;
  }
}
