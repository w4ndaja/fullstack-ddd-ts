import { PaymentStatus } from "@/common/utils/payment-status";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { EBookStatus } from "@/common/utils/book-status";

export interface ILiveTrainingParticipants {
  userId: string;
  fullname: string;
  email: string;
  phone: string;
  instance: string;
  isNew: boolean;
}

export interface LiveTraniningBookPayment {
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

export type ILiveTrainingBook = IEntity<{
  liveTrainingId: string;
  userId: string;
  mentorName: string;
  userName: string;
  title: string;
  startAt: number;
  participants: ILiveTrainingParticipants[];
  totalParticipant: number;
  payment: LiveTraniningBookPayment;
  status: string;
}>;

export type ILiveTrainingBookCreate = IEntityCreate<{
  liveTrainingId: string;
  userId: string;
  mentorName: string;
  userName: string;
  title: string;
  startAt: number;
  participants: ILiveTrainingParticipants[];
  totalParticipant?: number;
  payment: Partial<LiveTraniningBookPayment>;
  status?: string;
}>;

export class LiveTrainingBook extends Entity<ILiveTrainingBook> {
  constructor({ payment, totalParticipant, status, ...props }: ILiveTrainingBookCreate) {
    super({
      payment: {
        method: payment.method,
        adminFee: payment.adminFee || 0,
        tax: payment.tax || 0,
        subTotal: payment.subTotal || 0,
        total: payment.total || 0,
        date: payment.date || Date.now(),
        accountNo: payment.accountNo || "",
        expiredAt: payment.expiredAt || Date.now() + 86400000 * 2,
        paidAt: payment.paidAt || null,
        status: payment.status || PaymentStatus.PENDING.toString(),
      },
      totalParticipant: props.participants.length,
      status: status || EBookStatus.WAITINGPAYMENT.toString(),
      ...props,
    });
  }
  public static create(props: ILiveTrainingBookCreate): LiveTrainingBook {
    return new LiveTrainingBook(props);
  }
  public unmarshall(): ILiveTrainingBook {
    return {
      ...super.unmarshall(),
    };
  }
  public setPaid() {
    this.payment.paidAt = Date.now();
    this.payment.status = PaymentStatus.SETTLEMENT;
    this.status = EBookStatus.OCCURRING.toString();
    return this;
  }

  set userId(v: string) {
    this._props.userId = v;
  }
  get userId(): string {
    return this._props.userId;
  }
  set mentorName(v: string) {
    this._props.mentorName = v;
  }
  get mentorName(): string {
    return this._props.mentorName;
  }
  set userName(v: string) {
    this._props.userName = v;
  }
  get userName(): string {
    return this._props.userName;
  }
  set title(v: string) {
    this._props.title = v;
  }
  get title(): string {
    return this._props.title;
  }
  set startAt(v: number) {
    this._props.startAt = v;
  }
  get startAt(): number {
    return this._props.startAt;
  }
  get liveTrainingId(): string {
    return this._props.liveTrainingId;
  }
  set liveTrainingId(v: string) {
    this._props.liveTrainingId = v;
  }
  get participants(): ILiveTrainingParticipants[] {
    return this._props.participants;
  }
  set participants(v: ILiveTrainingParticipants[]) {
    this._props.participants = v;
  }
  get totalParticipant(): number {
    return this._props.totalParticipant;
  }
  set totalParticipant(v: number) {
    this._props.totalParticipant = v;
  }
  get payment(): LiveTraniningBookPayment {
    return this._props.payment;
  }
  set payment(v: LiveTraniningBookPayment) {
    this._props.payment = v;
  }
  get status(): string {
    return this._props.status;
  }
  set status(v: string) {
    this._props.status = v;
  }
}
