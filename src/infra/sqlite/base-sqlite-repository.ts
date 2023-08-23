import { injectable } from "inversify";
import { IBaseGetParam } from "../../common/utils/base-get-param";
import { BaseRepository } from "../../domain/service/base/base-repository";
import { IGenericPaginatedData } from "../../common/utils";

@injectable()
export class BaseSqliteRepository<T> implements BaseRepository<T> {
  findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<T>> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  store(param: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update(param: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  destroy(param: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
