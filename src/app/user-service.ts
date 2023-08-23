import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserRepository } from "../domain/service/user-repository";
import { IUser } from "../domain/model/user";

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepository) private _userRepository: UserRepository) {}
  public async findById(id: string): Promise<IUser> {
    const user = await this._userRepository.findById(id);
    return user.unmarshall();
  }
}
