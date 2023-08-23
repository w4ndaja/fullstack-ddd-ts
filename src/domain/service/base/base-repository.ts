import { IBaseGetParam } from "../../../common/utils/base-get-param";
import { IGenericPaginatedData } from "../../../common/utils/generic-paginated-data";

export interface BaseRepository<T>{
    findAll(param:IBaseGetParam):Promise<IGenericPaginatedData<T>>;
    findById(id:string):Promise<T>;
    store(param:T):Promise<T>;
    update(param:T):Promise<T>;
    destroy(param:T):Promise<T>;
}
