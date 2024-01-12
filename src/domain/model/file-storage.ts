import { Entity, IEntity, IEntityCreate } from "./entity";
export type IFileStorage = IEntity<{
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}>;

export type IFileStorageCreate = IEntityCreate<{
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}>;

export class FileStorage extends Entity<IFileStorage> {
  constructor(props: IFileStorageCreate) {
    super(props);
  }
  public static create(props: IFileStorageCreate) {
    return new FileStorage(props);
  }
  public unmarshall(): IFileStorage {
    return {
      id: this.id,
      originalname: this.originalname,
      encoding: this.encoding,
      mimetype: this.mimetype,
      size: this.size,
      destination: this.destination,
      filename: this.filename,
      path: this.path,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get originalname(): string {
    return this._props.originalname;
  }
  set originalname(v: string) {
    this._props.originalname = v;
  }
  get encoding(): string {
    return this._props.encoding;
  }
  set encoding(v: string) {
    this._props.encoding = v;
  }
  get mimetype(): string {
    return this._props.mimetype;
  }
  set mimetype(v: string) {
    this._props.mimetype = v;
  }
  get size(): number {
    return this._props.size;
  }
  set size(v: number) {
    this._props.size = v;
  }
  get destination(): string {
    return this._props.destination;
  }
  set destination(v: string) {
    this._props.destination = v;
  }
  get filename(): string {
    return this._props.filename;
  }
  set filename(v: string) {
    this._props.filename = v;
  }
  get path(): string {
    return this._props.path;
  }
  set path(v: string) {
    this._props.path = v;
  }
}
