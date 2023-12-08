import { Entity, IEntity, IEntityCreate } from "./entity";

export type IChatSession = IEntity<{
  audiens: string[];
  startBy: string;
  startAt: number;
  endAt: number;
  endBy: string;
}>;

export type IChatSessionCreate = IEntityCreate<{
  audiens: string[];
  startBy: string;
  startAt: number;
  endAt: number;
  endBy: string;
}>;

export class ChatSession extends Entity<IChatSession> {
  constructor(props: IChatSessionCreate) {
    super(props);
  }
  public static create(props: IChatSessionCreate): ChatSession {
    return new ChatSession(props);
  }
  public unmarshall(): IChatSession {
    return {
      id: this.id,
      audiens: this.audiens,
      startBy: this.startBy,
      startAt: this.startAt,
      endAt: this.endAt,
      endBy: this.endBy,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get audiens(): string[] {
    return this._props.audiens;
  }
  get startBy(): string {
    return this._props.startBy;
  }
  get startAt(): number {
    return this._props.startAt;
  }
  get endAt(): number {
    return this._props.endAt;
  }
  get endBy(): string {
    return this._props.endBy;
  }

  set audiens(value: string[]) {
    this._props.audiens = value;
  }

  set startBy(value: string) {
    this._props.startBy = value;
  }

  set startAt(value: number) {
    this._props.startAt = value;
  }

  set endAt(value: number) {
    this._props.endAt = value;
  }

  set endBy(value: string) {
    this._props.endBy = value;
  }
}
