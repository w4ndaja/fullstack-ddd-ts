import Crypto from "crypto";

export type IEntity<T = unknown> = {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
} & T;

export type IEntityCreate<T = unknown> = {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number | null;
} & T;

export type Unknown<T = Record<string, unknown>> = {
  [Property in keyof T]: T[Property];
};

/**
 * Base Entity builder for all domain model
 * auto generated UUID if doesnt exist on props
 * @return Entity<I>, where I is typeof addictional property on target model
 */
export class Entity<I> {
  protected _id: string;
  protected _props: IEntity<I>;

  /**
   * override this method on target class if need some addictional logic for entity creation, or just leave it
   * @param props required property for entity creation
   */
  constructor(_props: IEntityCreate | unknown) {
    const { id, createdAt, updatedAt, deletedAt, ...props } = <IEntityCreate>_props;
    this._id = id || Crypto.randomUUID();
    this._props = <IEntity<I>>{
      id: this._id,
      createdAt: createdAt || Date.now(),
      updatedAt: updatedAt || Date.now(),
      deletedAt: deletedAt || null,
      ...props,
    };
  }

  /**
   * alias for new Entity
   * @param _props required property for entiry creation
   * @returns Entity<I> instance
   */
  public static create(_props: unknown): unknown {
    return new Entity(_props);
  }

  public unmarshall(): IEntity<I> {
    const keyProps = Object.keys(this._props);
    let props: IEntity<I> = Object();
    keyProps.forEach((key) => {
      Object.assign(props, { [key]: this[key] || this._props[key] });
    });
    return {
      ...props,
      id: this.id,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }

  public update(): void {
    this._props.updatedAt = Date.now();
  }

  public delete(): void {
    this._props.deletedAt = Date.now();
  }

  public restore(): void {
    this._props.deletedAt = null;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  get deletedAt(): Date | null {
    return this._props.deletedAt ? new Date(this._props.deletedAt) : null;
  }
}
