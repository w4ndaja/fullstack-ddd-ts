import { IBaseGetParam, ICreateGenericPaginatedData } from "@/common/libs/pagination";

/**
 * Base repository with CRUD basic main method :
 * @method findAll method for retrieving paginated result data
 * @method findById method for retrieving single doc/data
 * @method save method for store/update new doc/data
 */

export interface IRepository<I> {
  findAll(param: IBaseGetParam): Promise<ICreateGenericPaginatedData<I>>;
  findById(id: string): Promise<I>;
  save(data: I): Promise<I>;
}
