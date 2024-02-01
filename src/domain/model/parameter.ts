import { Entity, IEntity, IEntityCreate } from "./entity";

export type IParameter = IEntity<{
  name: string;
  value: string;
}>;

export type IParameterCreate = IEntityCreate<{
  name: string;
  value: string;
}>;

export class Parameter extends Entity<IParameter> {
  constructor(props: IParameterCreate) {
    super(props);
  }
  public static create(props: IParameterCreate) {
    return new Parameter(props);
  }
  public unmarshall(): IParameter {
    return {
      ...super.unmarshall(),
    };
  }
  get name(): string {
    return this._props.name;
  }
  set name(v: string) {
    this._props.name = v;
  }
  get value(): string {
    return this._props.value;
  }
  set value(v: string) {
    this._props.value = v;
  }
}
