export interface IBasePaginationLink{
    page:number|null;
    label:number;
    active:boolean;
}
export interface IGenericPaginatedData<T>{
    page:number;
    limit:number;
    links:IBasePaginationLink[];
    from:number;
    to:number;
    totalPage:number;
    data:T[];
}
