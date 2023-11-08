import { ERoles } from "@/common/utils/roles";
import { Entity, IEntityCreate, IEntity } from "./entity";
import bcrypt from "bcrypt";
import { EPermissions } from "@/common/utils/permissions";

export type IUser = IEntity<{
  fullname: string | null;
  username: string | null;
  email: string;
  password: string;
  roles: string[];
  permissions: string[];
}>;

export type IUserCreate = IEntityCreate<{
  fullname?: string | null;
  username?: string | null;
  email: string;
  password?: string;
  roles?: string[];
  permissions?: string[];
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
      email: this.email,
      username: this.username,
      password: this.password,
      roles: this.roles.map((item) => item.toString()),
      permissions: this.permissions.map((item) => item.toString()),
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }

  get fullname(): string | null {
    return this._props.fullname || null;
  }

  get email(): string {
    return this._props.email;
  }

  get username(): string | null {
    return this._props.username || null;
  }

  get password(): string {
    return this._props.password;
  }

  set password(password: string) {
    this._props.password = bcrypt.hashSync(password, 10);
  }

  get roles(): ERoles[] {
    return <ERoles[]>this._props.roles || [];
  }

  set roles(roles: ERoles[]) {
    this._props.roles = roles;
  }

  get permissions(): EPermissions[] {
    return <EPermissions[]>this._props.permissions || [];
  }

  set permissions(permissions: ERoles[]) {
    this._props.permissions = permissions;
  }

  public hasRole(role: ERoles): boolean {
    if(role === ERoles.SUPER_ADMIN) return true;
    return this.roles.includes(role);
  }

  public setRole(role: ERoles): void {
    if (!this.hasRole(role)) {
      this.roles.push(role);
    }
  }

  public hasPermission(permission: EPermissions): boolean {
    if(this.hasRole(ERoles.SUPER_ADMIN)) return true;
    return this.permissions.includes(permission);
  }

  public setPermission(permission: EPermissions): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  public removeRole(role: ERoles): void {
    if (this.hasRole(role)) {
      this.roles = this.roles.filter((r) => r !== role);
    }
  }

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
