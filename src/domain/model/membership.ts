import { Entity, IEntity } from "./entity";

export type IMembership = IEntity<{
  thumbnailUrl: string;
  name: string;
  price: number;
  description: string;
}>;

export type IMembershipCreate = IEntity<{
  thumbnailUrl: string;
  name: string;
  price: number;
  description: string;
}>;

export class Membership extends Entity<IMembership> {
  constructor(props: IMembershipCreate) {
    super(props);
  }
  public static create(props: IMembershipCreate): Membership {
    return new Membership(props);
  }
  public unmarshall(): IMembership {
    return {
      id: this.id,
      thumbnailUrl: this.thumbnailUrl,
      name: this.name,
      price: this.price,
      description: this.description,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }
  get thumbnailUrl(): string {
    return this._props.thumbnailUrl;
  }
  get name(): string {
    return this._props.name;
  }
  get price(): number {
    return this._props.price;
  }
  get description(): string {
    return this._props.description;
  }
  set thumbnailUrl(value: string) {
    this._props.thumbnailUrl = value;
  }
  set name(value: string) {
    this._props.name = value;
  }
  set price(value: number) {
    this._props.price = value;
  }
  set description(value: string) {
    this._props.description = value;
  }
}
