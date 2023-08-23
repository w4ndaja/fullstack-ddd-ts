export interface IBaseModel {
  id?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date | null;
}

export interface IBaseCreateModel {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date | null;
}

export class BaseModel<IModel = IBaseModel, ICreateModel = IBaseCreateModel> {
  protected _id;
  protected _props: IModel & IBaseModel;
  constructor(props: ICreateModel & IBaseCreateModel) {
    const { id, createdAt, createdBy, updatedAt, updatedBy, deletedAt, ..._data } = props;
    const data = <IModel>_data;
    this._id = id || "nanoid()";
    this._props = {
      id: id,
      createdAt: createdAt || new Date(),
      createdBy: createdBy || "",
      updatedAt: updatedAt || new Date(),
      updatedBy: updatedBy || "",
      deletedAt: deletedAt || null,
      ...data,
    };
  }
  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._props.createdAt;
  }
  get createdBy(): string {
    return this._props.createdBy;
  }
  get updatedAt(): Date {
    return this._props.updatedAt;
  }
  get updatedBy(): string {
    return this._props.updatedBy;
  }
  get deletedAt(): Date | null {
    return this._props.deletedAt;
  }
}
