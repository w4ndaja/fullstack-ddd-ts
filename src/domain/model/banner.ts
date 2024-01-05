import { Entity, IEntity, IEntityCreate } from "./entity";

export type IBanner = IEntity<{
  order: number;
  imageUrl: string;
  data: object | null;
}>;

export type IBannerCreate = IEntityCreate<{
  order: number;
  imageUrl: string;
  data?: object | null;
}>;

export class Banner extends Entity<IBanner> {
  constructor(props: IBannerCreate) {
    super(props);
  }
  public static create(props: IBannerCreate) {
    return new Banner(props);
  }
  set order(v: number) {
    this._props.order = v;
  }
  get order(): number {
    return this._props.order;
  }
  set imageUrl(v: string) {
    this._props.imageUrl = v;
  }
  get imageUrl(): string {
    return this._props.imageUrl;
  }
  set data(v: object | null) {
    this._props.data = v;
  }
  get data(): object | null {
    return this._props.data;
  }
}
