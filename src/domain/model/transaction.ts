import { Entity, IEntity, IEntityCreate } from "@/domain/model/entity";

export type ITransaction = IEntity<{
  transaction_details: Transactiondetails;
  credit_card: Creditcard;
  customer_details: Customerdetails;
  token: string | null;
  redirect_url: string | null;
  notification: Object | null;
  callbacks: ICallbacks | null;
}>;

export type ITransactionCreate = IEntityCreate<{
  transaction_details: Transactiondetails;
  credit_card: Creditcard;
  customer_details: Customerdetails;
  token?: string | null;
  redirect_url?: string | null;
  notification?: Object | null;
  callbacks?: ICallbacks | null;
}>;

interface ICallbacks {
  finish: string;
}

interface Customerdetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Creditcard {
  secure: boolean;
}

interface Transactiondetails {
  order_id: string;
  gross_amount: number;
}

export class Transaction extends Entity<ITransaction> {
  constructor({ token, redirect_url, notification, callbacks, ...props }: ITransactionCreate) {
    super({
      token: token || null,
      redirect_url: redirect_url || null,
      notification: notification || null,
      callbacks: callbacks || null,
      ...props,
    });
  }
  public static create(_props: ITransactionCreate): Transaction {
    return new Transaction(_props);
  }
  public unmarshall(): IEntity<ITransaction> {
    return {
      ...super.unmarshall(),
    };
  }
  get transaction_details(): Transactiondetails {
    return this._props.transaction_details;
  }
  set transaction_details(v: Transactiondetails) {
    this._props.transaction_details = v;
  }
  get credit_card(): Creditcard {
    return this._props.credit_card;
  }
  set credit_card(v: Creditcard) {
    this._props.credit_card = v;
  }
  get customer_details(): Customerdetails {
    return this._props.customer_details;
  }
  set customer_details(v: Customerdetails) {
    this._props.customer_details = v;
  }

  get token(): string | null {
    return this._props.token;
  }
  set token(v: string | null) {
    this._props.token = v;
  }
  get redirect_url(): string | null {
    return this._props.redirect_url;
  }
  set redirect_url(v: string | null) {
    this._props.redirect_url = v;
  }
  get notification(): Object | null {
    return this._props.notification;
  }
  set notification(v: Object | null) {
    this._props.notification = v;
  }
  get callbacks(): ICallbacks | null {
    return this._props.callbacks;
  }
  set callbacks(v: ICallbacks | null) {
    this._props.callbacks = v;
  }
}
