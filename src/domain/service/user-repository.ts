import { User } from "../model/user";
import { BaseRepository } from "./base/base-repository";

export interface UserRepository extends BaseRepository<User> {
}
