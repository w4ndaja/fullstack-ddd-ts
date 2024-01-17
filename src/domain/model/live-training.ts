import { config } from "@/common/utils";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { ILiveTrainingBook, LiveTrainingBook } from "./live-training-book";

export type ILiveTrainingStatus = "ONGOING" | "COMINGSOON" | "ONDEMAND";

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
  incomeTotal: number;
  webUrl: string;
  startAt: number;
  endAt: number | null;
  status: ILiveTrainingStatus;
  maxAudiens: number;
  context: string;
  contextFilesUrl: string[];
  price: number;
  mentorFee: number;
  providerFee: number;
  authorized: boolean;
  liveTrainingBooks?: ILiveTrainingBook[];
}>;
export type ILiveTrainingCreate = IEntityCreate<{
  roomId?: string;
  title: string;
  duration?: number;
  thumbnailUrl: string;
  mentorId: string;
  fullname: string;
  avatarUrl: string;
  graduatedFrom: string;
  audiensAvatar?: string[];
  audiensCount?: number;
  incomeTotal?: number;
  webUrl?: string;
  startAt: number;
  endAt?: number | null;
  status?: ILiveTrainingStatus;
  maxAudiens: number;
  context: string;
  contextFilesUrl: string[];
  price?: number;
  mentorFee?: number;
  providerFee?: number;
  authorized?: boolean;
  liveTrainingBooks?: ILiveTrainingBook[];
}>;

export class LiveTraining extends Entity<ILiveTraining> {
  constructor({
    roomId,
    duration,
    audiensAvatar,
    audiensCount,
    incomeTotal,
    webUrl,
    endAt,
    status,
    price,
    mentorFee,
    providerFee,
    authorized,
    ...props
  }: ILiveTrainingCreate) {
    super({
      roomId: roomId || `${Date.now()}${Math.ceil(Math.random() * 9999)}`,
      duration: duration || 0,
      audiensAvatar: audiensAvatar || [],
      audiensCount: audiensCount || 0,
      incomeTotal: incomeTotal || 0,
      webUrl: webUrl,
      endAt: endAt || null,
      status: status || "COMINGSOON",
      price: price || 0,
      mentorFee: mentorFee || 50,
      providerFee: providerFee || 50,
      authorized: authorized || false,
      ...props,
    });
    switch (this.status) {
      case "COMINGSOON":
        this._props.duration = 0;
        break;
      case "ONGOING":
        this._props.duration = Math.ceil((Date.now() - this.startAt.getTime()) / 1000 / 60);
        break;
      case "ONDEMAND":
        this._props.duration = Math.ceil(
          (this.endAt.getTime() - this.startAt.getTime()) / 1000 / 60
        );
        break;
      default:
        this._props.duration = 0;
        break;
    }
  }
  public static create(props: ILiveTrainingCreate): LiveTraining {
    return new LiveTraining(props);
  }
  public unmarshall(): ILiveTraining {
    return {
      ...super.unmarshall(),
      liveTrainingBooks : this.liveTrainingBooks ? this.liveTrainingBooks.map(item => item.unmarshall()) : undefined,
      startAt: this.startAt.getTime(),
      endAt: this.endAt?.getTime() || null,
    };
  }
  public authorize() {
    this.authorized = true;
    const url = new URL("", config.camy.liveRoomUrl);
    url.searchParams.set("roomID", this.roomId);
    url.searchParams.set("userID", this.mentorId);
    url.searchParams.set("userName", this.fullname);
    this.webUrl = url.toString();
    return this;
  }

  public finish() {
    this.endAt = Date.now();
    this.status = "ONDEMAND";
    return this;
  }

  get roomId(): string {
    return this._props.roomId;
  }
  set roomId(v: string) {
    this._props.roomId = v;
  }
  get title(): string {
    return this._props.title;
  }
  set title(v: string) {
    this._props.title = v;
  }
  get duration(): number {
    return this._props.duration;
  }
  set duration(v: number) {
    this._props.duration = v;
  }
  get thumbnailUrl(): string {
    return this._props.thumbnailUrl;
  }
  set thumbnailUrl(v: string) {
    this._props.thumbnailUrl = v;
  }
  get mentorId(): string {
    return this._props.mentorId;
  }
  set mentorId(v: string) {
    this._props.mentorId = v;
  }
  get fullname(): string {
    return this._props.fullname;
  }
  set fullname(v: string) {
    this._props.fullname = v;
  }
  get avatarUrl(): string {
    return this._props.avatarUrl;
  }
  set avatarUrl(v: string) {
    this._props.avatarUrl = v;
  }
  get graduatedFrom(): string {
    return this._props.graduatedFrom;
  }
  set graduatedFrom(v: string) {
    this._props.graduatedFrom = v;
  }
  get audiensAvatar(): string[] {
    return this._props.audiensAvatar;
  }
  set audiensAvatar(v: string[]) {
    this._props.audiensAvatar = v;
  }
  get audiensCount(): number {
    return this._props.audiensCount;
  }
  set audiensCount(v: number) {
    this._props.audiensCount = v;
  }
  get incomeTotal(): number {
    return this._props.incomeTotal;
  }
  set incomeTotal(v: number) {
    this._props.incomeTotal = v;
  }
  get webUrl(): string {
    return this._props.webUrl;
  }
  set webUrl(v: string) {
    this._props.webUrl = v;
  }
  get startAt(): Date {
    return this._props.startAt ? new Date(this._props.startAt) : new Date();
  }
  set startAt(v: number) {
    this._props.startAt = v;
  }
  get endAt(): Date | null {
    return this._props.endAt ? new Date(this._props.endAt) : null;
  }
  set endAt(v: number | null) {
    this._props.endAt = v;
  }
  get status(): ILiveTrainingStatus {
    if (this._props.endAt && this._props.endAt <= Date.now()) {
      return "ONDEMAND";
    } else if (this._props.startAt <= Date.now()) {
      return "ONGOING";
    } else  {
      return this._props.status;
    }
  }
  set status(v: ILiveTrainingStatus) {
    this._props.status = v;
  }
  get maxAudiens(): number {
    return this._props.maxAudiens;
  }
  set maxAudiens(v: number) {
    this._props.maxAudiens = v;
  }
  get context(): string {
    return this._props.context;
  }
  set context(v: string) {
    this._props.context = v;
  }
  get contextFilesUrl(): string[] {
    return this._props.contextFilesUrl;
  }
  set contextFilesUrl(v: string[]) {
    this._props.contextFilesUrl = v;
  }
  get price(): number {
    return this._props.price;
  }
  set price(v: number) {
    this._props.price = v;
  }
  get mentorFee(): number {
    return this._props.mentorFee;
  }
  set mentorFee(v: number) {
    this._props.mentorFee = v;
  }
  get providerFee(): number {
    return this._props.providerFee;
  }
  set providerFee(v: number) {
    this._props.providerFee = v;
  }
  get authorized(): boolean {
    return this._props.authorized;
  }
  set authorized(v: boolean) {
    this._props.authorized = v;
  }
  get liveTrainingBooks(): LiveTrainingBook[] | undefined {
    return this._props.liveTrainingBooks
      ? this._props.liveTrainingBooks.map((item) => LiveTrainingBook.create(item))
      : undefined;
  }
  set liveTrainingBooks(v: ILiveTrainingBook[] | undefined) {
    this._props.liveTrainingBooks = v;
  }
}
