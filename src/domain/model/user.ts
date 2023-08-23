import { BaseModel, IBaseCreateModel, IBaseModel } from "./base/base-model";

export interface IUser extends IBaseModel {
  name: string;
}

export interface ICreateUser extends IBaseCreateModel {
  name: string;
}

export class User extends BaseModel<IUser, ICreateUser> {
  public unmarshall(): IUser {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
      deletedAt: this.deletedAt,
    };
  }
  public static create(props: ICreateUser): User {
    return new User(props);
  }
  public get name(): string {
    return this._props.name;
  }
}
