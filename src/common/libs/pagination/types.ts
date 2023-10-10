export interface IBasePaginationLink {
  page: number | null;
  label: string;
  active: boolean;
  disabled: boolean;
}
export interface IGenericPaginatedData<IData> {
  page: number;
  limit: number;
  links: IBasePaginationLink[];
  from: number;
  to: number;
  totalPage: number;
  totalRow: number;
  data: IData[];
}
export interface ICreateGenericPaginatedData<IData> {
  page: number;
  limit: number;
  data: IData[];
  totalRow: number;
}
export interface IBaseGetParam {
  search: string;
  page: number;
  limit: number;
}
