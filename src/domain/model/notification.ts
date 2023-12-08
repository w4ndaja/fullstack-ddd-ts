import { Entity, IEntity, IEntityCreate } from "./entity";

export type INotification = IEntity<{
  iconUrl: string;
  description: string;
  button: Button;
  target: string;
  targetPath: string;
}>;

export type INotificationCreate = IEntityCreate<{
  iconUrl: string;
  description: string;
  button: Button;
  target: string;
  targetPath: string;
}>;

export type Button = {
  isActive: boolean;
  label: string;
};

export class Notification extends Entity<INotification> {
  constructor(props: INotificationCreate) {
    super(props);
  }
  public static create(props: INotificationCreate): Notification {
    return new Notification(props);
  }
  public unmarshall(): INotification {
    return {
      id: this.id,
      iconUrl: this.iconUrl,
      description: this.description,
      button: this.button,
      target: this.target,
      targetPath: this.targetPath,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get iconUrl(): string {
    return this._props.iconUrl;
  }
  get description(): string {
    return this._props.description;
  }
  get button(): Button {
    return this._props.button;
  }
  get target(): string {
    return this._props.target;
  }
  get targetPath(): string {
    return this._props.targetPath;
  }

  set iconUrl(value: string) {
    this._props.iconUrl = value;
  }

  set description(value: string) {
    this._props.description = value;
  }

  set button(value: Button) {
    this._props.button = value;
  }

  set target(value: string) {
    this._props.target = value;
  }

  set targetPath(value: string) {
    this._props.targetPath = value;
  }
}
