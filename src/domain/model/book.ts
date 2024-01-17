import { EBookStatus } from "@/common/utils/book-status";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { IParticipant, Participant } from "./participant";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

export type IBook = IEntity<{
  bookId: string;
  status: string;
  participantId: string;
  participantAvatar: string;
  mentor: Mentor | null;
  className: string;
  duration: number;
  payment: Payment;
  expiredDate: number;
  acceptedAt: number | null;
  rejectedAt: number | null;
  canceledAt: number | null;
  canceledByUserId: string | null;
  participant?: IParticipant;
  participantName: string;
  sessions: string[];
  finishedAt: number | null;
  finishedBy: string | null;
  review: string;
  rating: number;
  sessionDate: number;
  start: number | null;
  end: number | null;
  mentorFee: number;
  providerFee: number;
}>;

export type IBookCreate = IEntityCreate<{
  bookId?: string;
  status?: string;
  participantId: string;
  participantAvatar: string;
  mentor: Mentor | null;
  className: string;
  duration?: number;
  payment: Payment;
  expiredDate?: number;
  acceptedAt?: number | null;
  rejectedAt?: number | null;
  canceledAt?: number | null;
  canceledByUserId?: string | null;
  participant?: IParticipant;
  participantName: string;
  sessions: string[];
  finishedAt?: number | null;
  finishedBy?: string | null;
  review?: string;
  rating?: number;
  sessionDate?: number;
  start?: number | null;
  end?: number | null;
  mentorFee?: number;
  providerFee?: number;
}>;

interface Payment {
  method: string;
  adminFee: number;
  tax: number;
  subTotal: number;
  total: number;
  date: number;
  accountNo: string;
  expiredAt: number;
  paidAt?: any;
  status: string;
}

interface Schedule {
  at: string;
  minutesAtDay: number;
  daysAtWeek: number;
  frequent: string;
}

interface Mentor {
  userId: string;
  mentorId: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export class Book extends Entity<IBook> {
  constructor({
    duration,
    acceptedAt,
    rejectedAt,
    canceledAt,
    canceledByUserId,
    participant,
    finishedAt,
    finishedBy,
    review,
    rating,
    start,
    end,
    mentorFee,
    providerFee,
    bookId,
    status,
    expiredDate,
    sessionDate,
    ...props
  }: IBookCreate) {
    super({
      bookId: bookId || Date.now().toString() + Math.floor(Math.random() * 9999).toString(),
      status: status || EBookStatus.PENDING.toString(),
      duration: duration || 60,
      acceptedAt: acceptedAt || null,
      rejectedAt: rejectedAt || null,
      canceledAt: canceledAt || null,
      canceledByUserId: canceledByUserId || null,
      participant: participant || null,
      finishedAt: finishedAt || null,
      finishedBy: finishedBy || null,
      review: review || "",
      rating: rating || 5,
      start: start || null,
      end: end || null,
      mentorFee: mentorFee || 50,
      providerFee: providerFee || 50,
      expiredDate: expiredDate || Date.now() + 86400000 * 2,
      sessionDate: sessionDate || Date.now(),
      ...props,
    });
  }
  public static create(props: IBookCreate): Book {
    return new Book(props);
  }
  public unmarshall(): IEntity<IBook> {
    return {
      id: this.id,
      bookId: this.bookId,
      status: this.status,
      participantId: this.participantId,
      participantAvatar: this.participantAvatar,
      mentor: this.mentor,
      className: this.className,
      duration: this.duration,
      payment: this.payment,
      expiredDate: this.expiredDate?.getTime() || null,
      acceptedAt: this.acceptedAt?.getTime() || null,
      canceledAt: this.canceledAt,
      canceledByUserId: this.canceledByUserId,
      rejectedAt: this.rejectedAt?.getTime() || null,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
      participant: this.participant?.unmarshall(),
      participantName: this.participantName,
      sessions: this.sessions,
      finishedAt: this.finishedAt?.getTime() || null,
      finishedBy: this.finishedBy,
      review: this.review,
      rating: this.rating,
      sessionDate: this.sessionDate?.getTime() || null,
      start: this.start?.getTime() || null,
      end: this.end?.getTime() || null,
      mentorFee: this.mentorFee,
      providerFee: this.providerFee,
    };
  }

  public setPrice(sessionCount: number, price: number) {
    this.duration = sessionCount * 60;
    this.payment.subTotal = sessionCount * price;
    this.payment.total = this.payment.subTotal + this.payment.adminFee + this.payment.tax;
  }

  public accept() {
    if (this.status !== EBookStatus.PENDING.toString())
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    this.acceptedAt = new Date();
    this.status = EBookStatus.WAITINGPAYMENT.toString();
    return this;
  }

  public reject(canceledBy: string) {
    if (this.status === EBookStatus.PENDING.toString()) {
      this.rejectedAt = Date.now();
      this.status = EBookStatus.REJECTED.toString();
      this.canceledByUserId = canceledBy;
    } else {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    }
    return this;
  }

  public setPaid() {
    if (this.status !== EBookStatus.WAITINGPAYMENT.toString())
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not waiting payment");
    this.payment.paidAt = Date.now();
    this.status = EBookStatus.OCCURRING.toString();
    return this;
  }

  public cancel(canceledBy: string) {
    if (this.status === EBookStatus.PENDING.toString()) {
      this.canceledAt = new Date();
      this.status = EBookStatus.CANCELED.toString();
      this.canceledByUserId = canceledBy;
    } else {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    }
    return this;
  }

  public finish(userId: string, rating: number, review: string) {
    if (
      this.status !== EBookStatus.OCCURRING.toString() &&
      this.status !== EBookStatus.FINISHED.toString()
    ) {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not occuring");
    }
    this.finishedAt = new Date();
    this.status = EBookStatus.FINISHED;
    this.finishedBy = userId;
    this.rating = rating;
    this.review = review;
    return this;
  }

  public isExpired(): Boolean {
    return this.expiredDate.getTime() < Date.now();
  }

  startChat() {
    this.start = new Date();
    this.end = new Date(this.start.getTime() + this.duration * 60000);
  }

  get bookId(): string {
    return this._props.bookId;
  }
  get status(): string {
    return this._props.status;
  }
  get participantId(): string {
    return this._props.participantId;
  }
  get mentor(): Mentor | null {
    return this._props.mentor;
  }
  get className(): string {
    return this._props.className;
  }
  get duration(): number {
    return this._props.duration;
  }
  get payment(): Payment {
    return this._props.payment;
  }
  get expiredDate(): Date {
    return this._props.expiredDate ? new Date(this._props.expiredDate) : new Date();
  }
  get acceptedAt(): Date | null {
    return this._props.acceptedAt ? new Date(this._props.acceptedAt) : null;
  }
  get canceledAt(): number | null {
    return this._props.canceledAt;
  }
  get canceledByUserId(): string | null {
    return this._props.canceledByUserId;
  }
  get rejectedAt(): Date | null {
    return this._props.rejectedAt ? new Date(this._props.rejectedAt) : null;
  }
  get participant(): Participant | undefined {
    return this._props.participant ? Participant.create(this._props.participant) : undefined;
  }
  set bookId(value: string) {
    this._props.bookId = value;
  }

  set status(value: string) {
    this._props.status = value;
  }

  set participantId(value: string) {
    this._props.participantId = value;
  }

  set mentor(value: Mentor) {
    this._props.mentor = value;
  }

  set className(value: string) {
    this._props.className = value;
  }

  set duration(value: number) {
    this._props.duration = value;
  }

  set payment(value: Payment) {
    this._props.payment = value;
  }

  set expiredDate(value: Date) {
    this._props.expiredDate = value.getTime();
  }

  set acceptedAt(value: Date | null) {
    this._props.acceptedAt = value.getTime();
  }

  set canceledAt(value: Date | null) {
    this._props.canceledAt = value.getTime();
  }

  set canceledByUserId(value: string | null) {
    this._props.canceledByUserId = value;
  }
  set rejectedAt(value: number | null) {
    this._props.rejectedAt = value;
  }
  set participant(value: Participant | undefined) {
    this._props.participant = value?.unmarshall();
  }
  set sessions(v: string[]) {
    this._props.sessions = v;
  }
  get sessions(): string[] {
    return this._props.sessions;
  }
  set finishedAt(v: Date | null) {
    this._props.finishedAt = v.getTime();
  }
  get finishedAt(): Date | null {
    return this._props.finishedAt ? new Date(this._props.finishedAt) : null;
  }
  set participantName(v: string) {
    this._props.participantName = v;
  }
  get participantName(): string {
    return this._props.participantName;
  }
  set finishedBy(v: string | null) {
    this._props.finishedBy = v;
  }
  get finishedBy(): string | null {
    return this._props.finishedBy;
  }
  set review(v: string) {
    this._props.review = v;
  }
  get review(): string {
    return this._props.review;
  }
  set rating(v: number) {
    this._props.rating = v;
  }
  get rating(): number {
    return this._props.rating;
  }

  set start(v: Date) {
    this._props.start = v.getTime();
  }
  get start(): Date | null {
    return this._props.start ? new Date(this._props.start) : null;
  }
  set end(v: Date) {
    this._props.end = v.getTime();
  }
  get end(): Date | null {
    return this._props.end ? new Date(this._props.end) : null;
  }
  set sessionDate(v: number) {
    this._props.sessionDate = v;
  }
  get sessionDate(): Date | null {
    return this._props.sessionDate ? new Date(this._props.sessionDate) : null;
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
  get participantAvatar(): string {
    return this._props.participantAvatar;
  }
  set participantAvatar(v: string) {
    this._props.participantAvatar = v;
  }
}
