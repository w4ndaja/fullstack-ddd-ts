import { Entity, IEntity, IEntityCreate } from "./entity";

export type IMentor = IEntity<{
  userId: string;
  username: string;
  fullname: string;
  avatarUrl: string;
  className: string[];
  bankInfo: {
    accountName: string;
    accountNo: string;
    name: string;
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
  certificates: {
    title: string;
    orgName: string;
    fileUrl: string;
  }[];
  rating: number;
  schedules: string[];
  nickname: string;
  bio: string;
  gender: string;
  lastEducation: string;
  company: {
    name: string;
    jobRole: string;
    jobLevel: string;
  };
  providerFee: number;
  mentorFee: number;
  feeAcceptedAt: number | null;
  email: string;
  approvedAt: number | null;
}>;

export type IMentorCreate = IEntityCreate<{
  userId: string;
  username: string;
  fullname: string;
  avatarUrl: string;
  className: string[];
  bankInfo: {
    accountName: string;
    accountNo: string;
    name: string;
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
  certificates: {
    title: string;
    orgName: string;
    fileUrl: string;
  }[];
  rating: number;
  schedules: string[];
  nickname: string;
  bio: string;
  gender: string;
  lastEducation: string;
  company: {
    name: string;
    jobRole: string;
    jobLevel: string;
  };
  providerFee: number;
  mentorFee: number;
  feeAcceptedAt: number | null;
  email?: string;
  approvedAt?: number | null;
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
      userId: this.userId,
      username: this.username,
      fullname: this.fullname,
      avatarUrl: this.avatarUrl,
      className: this.className,
      bankInfo: this.bankInfo,
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
      certificates: this.certificates,
      rating: this.rating,
      schedules: this.schedules,
      nickname: this.nickname,
      bio: this.bio,
      gender: this.gender,
      lastEducation: this.lastEducation,
      company: this.company,
      providerFee: this.providerFee,
      mentorFee: this.mentorFee,
      feeAcceptedAt: this.feeAcceptedAt,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
      email: this.email,
      approvedAt: this.approvedAt,
    };
  }
  get userId(): string {
    return this._props.userId;
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
  set userId(value: string) {
    this._props.userId = value;
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
  get certificates(): {
    title: string;
    orgName: string;
    fileUrl: string;
  }[] {
    return this._props.certificates;
  }
  set certificates(
    v: {
      title: string;
      orgName: string;
      fileUrl: string;
    }[]
  ) {
    this._props.certificates = v;
  }
  set rating(v: number) {
    this._props.rating = v;
  }
  get rating(): number {
    return this._props.rating;
  }
  set schedules(v: string[]) {
    this._props.schedules = v;
  }
  get schedules(): string[] {
    return this._props.schedules;
  }
  set nickname(v: string) {
    this._props.nickname = v;
  }
  get nickname(): string {
    return this._props.nickname;
  }
  set bio(v: string) {
    this._props.bio = v;
  }
  get bio(): string {
    return this._props.bio;
  }
  set gender(v: string) {
    this._props.gender = v;
  }
  get gender(): string {
    return this._props.gender;
  }
  set lastEducation(v: string) {
    this._props.lastEducation = v;
  }
  get lastEducation(): string {
    return this._props.lastEducation;
  }
  get company(): {
    name: string;
    jobRole: string;
    jobLevel: string;
  } {
    return this._props.company;
  }
  set company(v: { name: string; jobRole: string; jobLevel: string }) {
    this._props.company = v;
  }
  set providerFee(v: number) {
    this._props.providerFee = v;
  }
  get providerFee(): number {
    return this._props.providerFee;
  }
  set mentorFee(v: number) {
    this._props.mentorFee = v;
  }
  get mentorFee(): number {
    return this._props.mentorFee;
  }
  set feeAcceptedAt(v: number | null) {
    this._props.feeAcceptedAt = v;
  }
  get feeAcceptedAt(): number | null {
    return this._props.feeAcceptedAt;
  }
  get email(): string {
    return this._props.email || "";
  }
  set email(v: string) {
    this._props.email = v;
  }
  get approvedAt(): number | null {
    return this._props.approvedAt || null;
  }
  set approvedAt(v: number | null) {
    this._props.approvedAt = v;
  }
}
