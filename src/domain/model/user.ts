import { EROLES } from "@/common/utils/roles";
import { Entity, IEntityCreate, IEntity } from "./entity";
import bcrypt from "bcrypt";
import { EPERMISSIONS } from "@/common/utils/permissions";
import { IParticipant, Participant } from "@/domain/model/participant";
import { IMentor, Mentor } from "@/domain/model/mentor"; // Import Mentor
export type IUser = IEntity<{
  fullname: string | null;
  username: string | null;
  email: string;
  password: string;
  roles: string[];
  permissions: string[];
  participant?: IParticipant;
  mentor?: IMentor; // Add mentor property
}>;

export type IUserCreate = IEntityCreate<{
  fullname?: string | null;
  username?: string | null;
  email: string;
  password?: string;
  roles?: string[];
  permissions?: string[];
  participant?: IParticipant;
  mentor?: IMentor; // Add mentor property
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
      participant: this.participant?.unmarshall(),
      mentor: this.mentor?.unmarshall(), // Add mentor property
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

  get roles(): EROLES[] {
    return <EROLES[]>this._props.roles || [];
  }

  set roles(roles: EROLES[]) {
    this._props.roles = roles;
  }

  get permissions(): EPERMISSIONS[] {
    return <EPERMISSIONS[]>this._props.permissions || [];
  }

  set permissions(permissions: EROLES[]) {
    this._props.permissions = permissions;
  }

  get participant(): Participant | undefined {
    return this._props.participant ? Participant.create(this._props.participant) : undefined;
  }

  set participant(participant: Participant | undefined) {
    this._props.participant = participant?.unmarshall();
  }

  get mentor(): Mentor | undefined { // Add mentor getter
    return this._props.mentor ? Mentor.create(this._props.mentor) : undefined;
  }

  set mentor(mentor: Mentor | undefined) { // Add mentor setter
    this._props.mentor = mentor?.unmarshall();
  }

  public hasRole(role: EROLES): boolean {
    if(role === EROLES.SUPER_ADMIN) return true;
    return this.roles.includes(role);
  }

  public setRole(role: EROLES): void {
    if (!this.hasRole(role)) {
      this.roles.push(role);
    }
  }

  public hasPermission(permission: EPERMISSIONS): boolean {
    if(this.hasRole(EROLES.SUPER_ADMIN)) return true;
    return this.permissions.includes(permission);
  }

  public setPermission(permission: EPERMISSIONS): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  public removeRole(role: EROLES): void {
    if (this.hasRole(role)) {
      this.roles = this.roles.filter((r) => r !== role);
    }
  }

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
