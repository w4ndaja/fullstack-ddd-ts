import { Entity, IEntity, IEntityCreate } from "./entity";

export type IBook = IEntity<{
  bookId: string;
  status: string;
  participantId: string;
  mentor: Mentor;
  type: string;
  classDate: number;
  schedule: Schedule;
  payment: Payment;
  expiredDate: number;
  acceptedAt: number | null;
  rejectedAt: number | null;
  canceledAt: number | null;
  canceledBy: string | null;
}>;

export type IBookCreate = IEntityCreate<{
  bookId: string;
  status: string;
  participantId: string;
  mentor: Mentor;
  type: string;
  classDate: number;
  schedule: Schedule;
  payment: Payment;
  expiredDate: number;
  acceptedAt?: number | null;
  rejectedAt?: number | null;
  canceledAt?: number | null;
  canceledBy?: string | null;
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
      type: this.type,
      classDate: this.classDate,
      schedule: this.schedule,
      payment: this.payment,
      expiredDate: this.expiredDate,
      acceptedAt: this.acceptedAt,
      canceledAt: this.canceledAt,
      canceledBy: this.canceledBy,
      rejectedAt: this.rejectedAt,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
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
  get mentor(): Mentor {
    return this._props.mentor;
  }
  get type(): string {
    return this._props.type;
  }
  get classDate(): number {
    return this._props.classDate;
  }
  get schedule(): Schedule {
    return this._props.schedule;
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
  get canceledBy(): string | null {
    return this._props.canceledBy;
  }
  get rejectedAt(): number | null {
    return this._props.rejectedAt;
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

  set type(value: string) {
    this._props.type = value;
  }

  set classDate(value: number) {
    this._props.classDate = value;
  }

  set schedule(value: Schedule) {
    this._props.schedule = value;
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

  set canceledBy(value: string | null) {
    this._props.canceledBy = value;
  }
  set rejectedAt(value: number | null) {
    this._props.rejectedAt = value;
  }
}
