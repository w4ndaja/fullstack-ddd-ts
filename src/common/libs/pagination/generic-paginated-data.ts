import { Entity } from "@/domain/model/entity";
import { IBasePaginationLink, ICreateGenericPaginatedData, IGenericPaginatedData } from "./types";
export class GenericPaginatedData<Data, IData> {
  private _props: IGenericPaginatedData<IData>;
  constructor({ page, limit, data, totalRow }: ICreateGenericPaginatedData<IData>) {
    // TODO: Make logic for paginate data creation
    this._props = {
      page,
      limit,
      links: [],
      from: 1,
      to: 10,
      totalPage: Math.ceil(totalRow / limit),
      totalRow: totalRow,
      data,
    };
  }
  public static create<Data, IData>(props: ICreateGenericPaginatedData<IData>): GenericPaginatedData<Data, IData> {
    return new GenericPaginatedData<Data, IData>(props);
  }
  public unmarshall(): IGenericPaginatedData<IData> {
    return {
      page: this.page,
      limit: this.limit,
      links: this.links,
      from: this.from,
      to: this.to,
      totalPage: this.totalPage,
      totalRow: this.totalRow,
      data: this.data.map((item) => <IData>item.unmarshall()),
    };
  }
  get page(): number {
    return this._props.page;
  }
  get limit(): number {
    return this._props.limit;
  }
  get links(): IBasePaginationLink[] {
    const links: IBasePaginationLink[] = [];
    links.push({
      page: 1,
      label: "First",
      active: false,
      disabled: this.page === 1,
    });
    links.push({
      page: this.page - 1,
      label: "Prev",
      active: false,
      disabled: this.page === this.page - 1 || this.page < 2,
    });
    links.push({
      page: this.page,
      label: `${this.page}`,
      active: true,
      disabled: true,
    });
    links.push({
      page: this.page + 1,
      label: "Next",
      active: false,
      disabled: this.page === this.page + 1 || this.page === this.totalPage,
    });
    links.push({
      page: this.totalPage,
      label: "Last",
      active: false,
      disabled: this.page === this.totalPage,
    });
    return links;
  }
  get from(): number {
    return this.page == 1 ? 1 : ((this.page - 1) * this.limit) + 1;
  }
  get to(): number {
    return this.from + this.limit - 1;
  }
  get totalPage(): number {
    return this._props.totalPage;
  }
  get totalRow(): number {
    return this._props.totalRow;
  }
  get data(): Entity<Data>[] {
    return this._props.data.map((item) => <Entity<Data>>Entity.create(item));
  }
}
