import { Book, IBook } from "./book";
import { Entity, IEntity, IEntityCreate } from "./entity";
import { IUser, User } from "./user";

export type IChatSession = IEntity<{
  mentor: IUser;
  participant: IUser;
  remainingMinutes: number;
  book: IBook | null;
  startAt: number | null;
  endAt: number | null;
}>;

export type IChatSessionCreate = IEntityCreate<{
  mentor: IUser;
  participant: IUser;
  book?: IBook | null;
  remainingMinutes?: number;
  startAt?: number | null;
  endAt?: number | null;
}>;

export class ChatSession extends Entity<IChatSession> {
  constructor(props: IChatSessionCreate) {
    super(props);
  }
  public static create(props: IChatSessionCreate): ChatSession {
    return new ChatSession(props);
  }
  public unmarshall(): IChatSession {
    return {
      ...super.unmarshall(),
      remainingMinutes: this.remainingMinutes,
      mentor: this.mentor.unmarshall(),
      participant: this.participant.unmarshall(),
      book: this.book?.unmarshall() || undefined,
      startAt: this.startAt?.getTime() || null,
      endAt: this.endAt?.getTime() || null,
    };
  }
  start(duration: number) {
    this.startAt = new Date();
    this.endAt = new Date(this.startAt.getTime() + duration * 60 * 1000);
    return this;
  }
  get mentor(): User {
    return User.create(this._props.mentor);
  }
  set mentor(v: User) {
    this._props.mentor = v.unmarshall();
  }
  get participant(): User {
    return User.create(this._props.participant);
  }
  set participant(v: User) {
    this._props.participant = v.unmarshall();
  }
  get remainingMinutes(): number {
    if(!this.endAt){
      if (this.book) {
        this.endAt = new Date(Date.now() + this.book.duration * 60 * 1000);
      }else{
        this.endAt = new Date(Date.now() + 60000);
      }
    }
    return Math.ceil((this.endAt.getTime() - Date.now()) / 1000 / 60);
  }
  set remainingMinutes(v: number) {
    this._props.remainingMinutes = v;
  }
  get book(): Book | null {
    return this._props.book ? Book.create(this._props.book) : null;
  }
  set book(v: Book | null) {
    this._props.book = v?.unmarshall() || null;
  }
  get startAt(): Date | null {
    return this._props.startAt ? new Date(this._props.startAt) : null;
  }
  set startAt(v: Date) {
    this._props.startAt = v.getTime();
  }
  get endAt(): Date | null {
    return this._props.endAt ? new Date(this._props.endAt) : null;
  }
  set endAt(v: Date) {
    this._props.endAt = v.getTime();
  }
}
