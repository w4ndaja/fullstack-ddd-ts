import { injectable } from "inversify";
import { IBaseGetParam } from "../../common/utils/base-get-param";
import { IGenericPaginatedData } from "../../common/utils/generic-paginated-data";

@injectable()
export class BaseRepository<T> implements BaseRepository<T> {
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
