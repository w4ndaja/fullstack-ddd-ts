import { Entity, IEntity, IEntityCreate } from "./entity";

export type ILiveTraining = IEntity<{
  roomId: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
  mentorId: string;
  fullname: string;
  avatarUrl: string;
  graduatedFrom: string;
  audiensAvatar: string[];
  audiensCount: number;
  newFollowerCount: number;
  incomeTotal: number;
  urlShare: string;
  startAt: number;
  endAt: number;
}>;
export type ILiveTrainingCreate = IEntityCreate<{
  roomId: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
  mentorId: string;
  fullname: string;
  avatarUrl: string;
  graduatedFrom: string;
  audiensAvatar: string[];
  audiensCount: number;
  newFollowerCount: number;
  incomeTotal: number;
  urlShare: string;
  startAt: number;
  endAt: number;
}>;

export class LiveTraining extends Entity<ILiveTraining> {
  constructor(props: ILiveTrainingCreate) {
    super(props);
  }
  public static create(props: ILiveTrainingCreate): LiveTraining {
    return new LiveTraining(props);
  }
  public unmarshall(): ILiveTraining {
    return {
      id: this.id,
      roomId: this.roomId,
      title: this.title,
      duration: this.duration,
      thumbnailUrl: this.thumbnailUrl,
      mentorId: this.mentorId,
      fullname: this.fullname,
      avatarUrl: this.avatarUrl,
      graduatedFrom: this.graduatedFrom,
      audiensAvatar: this.audiensAvatar,
      audiensCount: this.audiensCount,
      newFollowerCount: this.newFollowerCount,
      incomeTotal: this.incomeTotal,
      urlShare: this.urlShare,
      startAt: this.startAt,
      endAt: this.endAt,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get roomId(): string {
    return this._props.roomId;
  }
  get title(): string {
    return this._props.title;
  }
  get duration(): number {
    return this._props.duration;
  }
  get thumbnailUrl(): string {
    return this._props.thumbnailUrl;
  }
  get mentorId(): string {
    return this._props.mentorId;
  }
  get fullname(): string {
    return this._props.fullname;
  }
  get avatarUrl(): string {
    return this._props.avatarUrl;
  }
  get graduatedFrom(): string {
    return this._props.graduatedFrom;
  }
  get audiensAvatar(): string[] {
    return this._props.audiensAvatar;
  }
  get audiensCount(): number {
    return this._props.audiensCount;
  }
  get newFollowerCount(): number {
    return this._props.newFollowerCount;
  }
  get incomeTotal(): number {
    return this._props.incomeTotal;
  }
  get urlShare(): string {
    return this._props.urlShare;
  }
  get startAt(): number {
    return this._props.startAt;
  }
  get endAt(): number {
    return this._props.endAt;
  }
  set roomId(value: string) {
    this._props.roomId = value;
  }
  set title(value: string) {
    this._props.title = value;
  }
  set duration(value: number) {
    this._props.duration = value;
  }
  set thumbnailUrl(value: string) {
    this._props.thumbnailUrl = value;
  }
  set mentorId(value: string) {
    this._props.mentorId = value;
  }
  set fullname(value: string) {
    this._props.fullname = value;
  }
  set avatarUrl(value: string) {
    this._props.avatarUrl = value;
  }
  set graduatedFrom(value: string) {
    this._props.graduatedFrom = value;
  }
  set audiensAvatar(value: string[]) {
    this._props.audiensAvatar = value;
  }
  set audiensCount(value: number) {
    this._props.audiensCount = value;
  }
  set newFollowerCount(value: number) {
    this._props.newFollowerCount = value;
  }
  set incomeTotal(value: number) {
    this._props.incomeTotal = value;
  }
  set urlShare(value: string) {
    this._props.urlShare = value;
  }
  set startAt(value: number) {
    this._props.startAt = value;
  }
  set endAt(value: number) {
    this._props.endAt = value;
  }
}
