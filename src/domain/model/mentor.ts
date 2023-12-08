import { Entity, IEntity, IEntityCreate } from "./entity";

export type IMentor = IEntity<{
  username: string;
  fullname: string;
  avatarUrl: string;
  className: string[];
  bankInfo: {
    accountName: string;
    accountNo: string;
    name: string;
  };
  company: {
    name: string;
  };
  graduateFrom: {
    name: string;
    region: string;
  };
  introVideo: {
    service: string;
    url: string;
  };
  availableClasses: string[];
  upcomingClasses: {
    type: string;
    classDate: number;
    duration: number;
  }[];
  highlightedUpcomingClass: {
    type: string;
    className: string;
    thumbnailUrl: string;
  };
  liveClasses: {
    thumbnailUrl: string;
    className: string;
    classDate: number;
  }[];
  isOnline: boolean;
  reviewPoint: number;
  price: number;
  isCertified: boolean;
  joinedAt: number;
}>;

export type IMentorCreate = IEntityCreate<{
  username: string;
  fullname: string;
  avatarUrl: string;
  className: string[];
  bankInfo: {
    accountName: string;
    accountNo: string;
    name: string;
  };
  company: {
    name: string;
  };
  graduateFrom: {
    name: string;
    region: string;
  };
  introVideo: {
    service: string;
    url: string;
  };
  availableClasses: string[];
  upcomingClasses: {
    type: string;
    classDate: number;
    duration: number;
  }[];
  highlightedUpcomingClass: {
    type: string;
    className: string;
    thumbnailUrl: string;
  };
  liveClasses: {
    thumbnailUrl: string;
    className: string;
    classDate: number;
  }[];
  isOnline: boolean;
  reviewPoint: number;
  price: number;
  isCertified: boolean;
  joinedAt: number;
}>;

export class Mentor extends Entity<IMentor> {
  constructor(props: IMentorCreate) {
    super(props);
  }
  public static create(props: IMentorCreate): Mentor {
    return new Mentor(props);
  }
  public unmarshall(): IEntity<IMentor> {
    return {
      id: this.id,
      username: this.username,
      fullname: this.fullname,
      avatarUrl: this.avatarUrl,
      className: this.className,
      bankInfo: this.bankInfo,
      company: this.company,
      graduateFrom: this.graduateFrom,
      introVideo: this.introVideo,
      availableClasses: this.availableClasses,
      upcomingClasses: this.upcomingClasses,
      highlightedUpcomingClass: this.highlightedUpcomingClass,
      liveClasses: this.liveClasses,
      isOnline: this.isOnline,
      reviewPoint: this.reviewPoint,
      price: this.price,
      isCertified: this.isCertified,
      joinedAt: this.joinedAt,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get username(): string {
    return this._props.username;
  }
  get fullname(): string {
    return this._props.fullname;
  }
  get avatarUrl(): string {
    return this._props.avatarUrl;
  }
  get className(): string[] {
    return this._props.className;
  }
  get bankInfo(): {
    accountName: string;
    accountNo: string;
    name: string;
  } {
    return this._props.bankInfo;
  }
  get company(): {
    name: string;
  } {
    return this._props.company;
  }
  get graduateFrom(): {
    name: string;
    region: string;
  } {
    return this._props.graduateFrom;
  }
  get introVideo(): {
    service: string;
    url: string;
  } {
    return this._props.introVideo;
  }
  get availableClasses(): string[] {
    return this._props.availableClasses;
  }
  get upcomingClasses(): {
    type: string;
    classDate: number;
    duration: number;
  }[] {
    return this._props.upcomingClasses;
  }
  get highlightedUpcomingClass(): {
    type: string;
    className: string;
    thumbnailUrl: string;
  } {
    return this._props.highlightedUpcomingClass;
  }
  get liveClasses(): {
    thumbnailUrl: string;
    className: string;
    classDate: number;
  }[] {
    return this._props.liveClasses;
  }
  get isOnline(): boolean {
    return this._props.isOnline;
  }
  get reviewPoint(): number {
    return this._props.reviewPoint;
  }
  get price(): number {
    return this._props.price;
  }
  get isCertified(): boolean {
    return this._props.isCertified;
  }
  get joinedAt(): number {
    return this._props.joinedAt;
  }
  set username(value: string) {
    this._props.username = value;
  }

  set fullname(value: string) {
    this._props.fullname = value;
  }

  set avatarUrl(value: string) {
    this._props.avatarUrl = value;
  }

  set className(value: string[]) {
    this._props.className = value;
  }

  set bankInfo(value: { accountName: string; accountNo: string; name: string }) {
    this._props.bankInfo = value;
  }

  set company(value: { name: string }) {
    this._props.company = value;
  }

  set graduateFrom(value: { name: string; region: string }) {
    this._props.graduateFrom = value;
  }

  set introVideo(value: { service: string; url: string }) {
    this._props.introVideo = value;
  }

  set availableClasses(value: string[]) {
    this._props.availableClasses = value;
  }

  set upcomingClasses(value: { type: string; classDate: number; duration: number }[]) {
    this._props.upcomingClasses = value;
  }

  set highlightedUpcomingClass(value: { type: string; className: string; thumbnailUrl: string }) {
    this._props.highlightedUpcomingClass = value;
  }

  set liveClasses(value: { thumbnailUrl: string; className: string; classDate: number }[]) {
    this._props.liveClasses = value;
  }

  set isOnline(value: boolean) {
    this._props.isOnline = value;
  }

  set reviewPoint(value: number) {
    this._props.reviewPoint = value;
  }

  set price(value: number) {
    this._props.price = value;
  }

  set isCertified(value: boolean) {
    this._props.isCertified = value;
  }

  set joinedAt(value: number) {
    this._props.joinedAt = value;
  }
}
