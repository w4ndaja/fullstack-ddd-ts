import { Entity, IEntity, IEntityCreate } from "./entity";

export type IClassCategory = IEntity<{
  name: string;
  icon: string;
  order: number;
}>;

export type IClassCategoryCreate = IEntityCreate<{
  name: string;
  icon: string;
  order: number;
}>;

export class ClassCategory extends Entity<IClassCategory> {
  constructor(props: IClassCategoryCreate) {
    super(props);
  }
  public static create(props: IClassCategoryCreate): ClassCategory {
    return new ClassCategory(props);
  }
  public unmarshall(): IClassCategory {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      order: this.order,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get name(): string {
    return this._props.name;
  }
  get icon(): string {
    return this._props.icon;
  }
  get order(): number {
    return this._props.order;
  }
  set name(name: string) {
    this._props.name = name;
  }
  set icon(icon: string) {
    this._props.icon = icon;
  }
  set order(order: number) {
    this._props.order = order;
  }
}
