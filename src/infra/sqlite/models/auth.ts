import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Auth {
  @PrimaryColumn()
  declare id: string;
  @Column()
  declare userId: string;
  @Column()
  declare expiredAt: number;
  @Column()
  declare expired: boolean;
  @Column()
  declare lastLoginAt: number;
  @Column()
  declare token: string;
  @Column()
  declare createdAt: number;
  @Column()
  declare updatedAt: number;
  @Column()
  declare deletedAt: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  declare user: User;
}
