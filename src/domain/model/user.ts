import { Entity, IEntityCreate, IEntity, Unknown } from "./entity";
import bcrypt from "bcrypt";

export type IUser = IEntity<{
  fullname: string;
  username: string;
  password: string;
}>;

export type IUserCreate = IEntityCreate<{
  fullname: string;
  username: string;
  password?: string;
}>;

export class User extends Entity<IUser> {
  /**
   * Optional, leave it if nothing to do here
   * @param props Properties of user like id, fullname, birtdate, etc
   */
  constructor(props: IUserCreate) {
    super(props);
  }

  /**
   * Optional, leave it if nothing to do here
   * @param props Required Properties for user creation
   * @returns User
   */
  public static create(props: IUserCreate): User {
    return new User(props);
  }

  public unmarshall(): IUser {
    return {
      id: this.id,
      fullname: this.fullname,
      username: this.username,
      password: this.password,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }

  get fullname(): string {
    return this._props.fullname;
  }

  get username(): string {
    return this._props.username;
  }

  get password(): string {
    return this._props.password;
  }

  set password(password: string) {
    this._props.password = bcrypt.hashSync(password, 10);
  }

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
