import type { IUserRepository } from "@/domain/service/user-repository";
import type { IUserCreate, IUser } from "@/domain/model";
import { GenericPaginatedData, IBaseGetParam } from "@/common/libs/pagination";
import type { Logger } from "@/common/libs/logger/logger";
import type { IGenericPaginatedData } from "@/common/libs/pagination";
import { inject, injectable } from "inversify";
import { TYPES } from "@/ioc/types";
import { User } from "@/domain/model";

/**
 * UserService
 * Use case or bussiness logic for domain user
 */
@injectable()
export class UserService {
  @inject(TYPES.UserRepository) private declare _userRepository: IUserRepository;
  @inject(TYPES.Logger) private declare logger: Logger;

  public async findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<IUser>> {
    const usersDto = await this._userRepository.findAll(param);
    const users = GenericPaginatedData.create({
      ...usersDto,
      data: usersDto.data.map((item) => User.create(item).unmarshall()),
    }).unmarshall();
    return users;
  }

  public async findById(id: IUser["id"]): Promise<IUser> {
    const user = await this._userRepository.findById(id);
    return user;
  }

  public async save(param: IUserCreate): Promise<IUser> {
    const userEntity = User.create(param);
    if (!param.id && param.password && param.password.length !== 60) {
      userEntity.password = param.password;
    }
    const _userEntity = userEntity.unmarshall();
    const userPersist = await this._userRepository.save(_userEntity);
    return userPersist;
  }

  public async destroy(id: IUser["id"]): Promise<IUser> {
    const user = User.create(await this._userRepository.findById(id));
    user.delete();
    const _user = user.unmarshall();
    await this._userRepository.save(_user);
    return _user;
  }
}
