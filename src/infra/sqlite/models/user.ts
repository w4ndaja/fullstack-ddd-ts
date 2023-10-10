import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  declare id: string;
  @Column()
  declare fullname: string;
  @Column()
  declare username: string;
  @Column()
  declare password: string;
  @Column()
  declare createdAt: number;
  @Column()
  declare updatedAt: number;
  @Column()
  declare deletedAt: number;
//   @OneToMany(() => Auth, (auth) => auth.user)
//   declare auths: Auth[];
}
