import { EBookStatus } from "@/common/utils/book-status";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { IParticipant, Participant } from "./participant";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

export type IBook = IEntity<{
  bookId: string;
  status: string;
  participantId: string;
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
}>;

export type IBookCreate = IEntityCreate<{
  bookId: string;
  status: string;
  participantId: string;
  mentor: Mentor | null;
  className: string;
  duration?: number;
  payment: Payment;
  expiredDate: number;
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
}

export class Book extends Entity<IBook> {
  constructor(props: IBookCreate) {
    super(props);
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
      mentor: this.mentor,
      className: this.className,
      duration: this.duration,
      payment: this.payment,
      expiredDate: this.expiredDate,
      acceptedAt: this.acceptedAt,
      canceledAt: this.canceledAt,
      canceledByUserId: this.canceledByUserId,
      rejectedAt: this.rejectedAt,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
      participant: this.participant?.unmarshall(),
      participantName: this.participantName,
      sessions: this.sessions,
      finishedAt: this.finishedAt,
      finishedBy: this.finishedBy,
      review: this.review,
      rating: this.rating,
    };
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
  get expiredDate(): number {
    return this._props.expiredDate;
  }
  get acceptedAt(): number | null {
    return this._props.acceptedAt;
  }
  get canceledAt(): number | null {
    return this._props.canceledAt;
  }
  get canceledByUserId(): string | null {
    return this._props.canceledByUserId;
  }
  get rejectedAt(): number | null {
    return this._props.rejectedAt;
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

  set expiredDate(value: number) {
    this._props.expiredDate = value;
  }

  set acceptedAt(value: number | null) {
    this._props.acceptedAt = value;
  }

  set canceledAt(value: number | null) {
    this._props.canceledAt = value;
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
  set finishedAt(v: number | null) {
    this._props.finishedAt = v;
  }
  get finishedAt(): number | null {
    return this._props.finishedAt;
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

  public setPrice(sessionCount: number, price: number) {
    this.duration = sessionCount * 60;
    this.payment.subTotal = sessionCount * price;
    this.payment.total = this.payment.subTotal + this.payment.adminFee + this.payment.tax;
  }

  public accept() {
    if (this.status !== EBookStatus.PENDING.toString())
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    this.acceptedAt = Date.now();
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
      this.canceledAt = Date.now();
      this.status = EBookStatus.CANCELED.toString();
      this.canceledByUserId = canceledBy;
    } else {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    }
    return this;
  }

  public finish(userId: string) {
    if (this.status !== EBookStatus.OCCURRING.toString()) {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Book is not pending");
    }
    this._props.finishedAt = Date.now();
    this._props.status = EBookStatus.FINISHED;
    this._props.finishedBy = userId;
    return this;
  }
}
