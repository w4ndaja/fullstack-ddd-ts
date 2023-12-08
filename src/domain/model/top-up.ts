import { Entity, IEntity } from "./entity";

export type ITopUp = IEntity<{
  userId: string;
  payment: Payment;
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
}

export class TopUp extends Entity<ITopUp> {
  constructor(props: ITopUp) {
    super(props);
  }
  public static create(props: ITopUp): TopUp {
    return new TopUp(props);
  }
  public unmarshall(): ITopUp {
    return {
      id: this.id,
      userId: this.userId,
      payment: this.payment,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      deletedAt: this.deletedAt?.getTime() || null,
    };
  }
  get userId(): string {
    return this._props.userId;
  }
  get payment(): Payment {
    return this._props.payment;
  }
  set userId(userId: string) {
    this._props.userId = userId;
  }
  set payment(value: Payment) {
    this._props.payment = value;
  }
}
