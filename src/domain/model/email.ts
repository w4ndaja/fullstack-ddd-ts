import { HeaderValue } from "mailparser";
import { Entity, IEntity, IEntityCreate } from "./entity";

export type AddressDetail = {
  name: string;
  address: string;
  group: string;
};

export type Address = {
  value: AddressDetail[];
  text: string;
  html: string;
};

export type Attachment = {
  filename: string;
  contentType: string;
  contentDisposition: string;
  checksum: string;
  size: string;
  headers: string;
  content: string;
  contentId: string;
  cid: string;
  related: string;
};

export type IEMail = IEntity<{
  headers: Map<string, HeaderValue>;
  mailboxName: string;
  subject: string;
  from: Address;
  to: Address;
  cc: Address;
  bcc: Address;
  date: Date;
  messageId: string;
  inReplyTo: string;
  reply: Address;
  references: string | string[];
  html: string;
  text: string;
  textAsHtml: string;
  attachments: Attachment[];
  ownerAddress: string;
}>;

export type IEmailCreate = IEntityCreate<{
  headers: Map<string, HeaderValue>;
  mailboxName: string;
  subject: string;
  from: Address;
  to: Address;
  cc: Address;
  bcc: Address;
  date: Date;
  messageId: string;
  inReplyTo: string;
  reply: Address;
  references: string | string[];
  html: string;
  text: string;
  textAsHtml: string;
  attachments: Attachment[];
  ownerAddress: string;
}>;

export class Mail extends Entity<IEMail> {
  constructor(props: IEmailCreate) {
    super(props);
  }
  public static create(props: IEmailCreate) {
    return new Mail(props);
  }
  public unmarshall(): IEntity<IEMail> {
    return {
      ...super.unmarshall(),
    };
  }
  get headers(): Map<string, HeaderValue> {
    return this._props.headers;
  }
  set headers(v: Map<string, HeaderValue>) {
    this._props.headers = v;
  }
  get mailboxName(): string {
    return this._props.mailboxName;
  }
  set mailboxName(v: string) {
    this._props.mailboxName = v;
  }
  get subject(): string {
    return this._props.subject;
  }
  set subject(v: string) {
    this._props.subject = v;
  }
  get from(): Address {
    return this._props.from;
  }
  set from(v: Address) {
    this._props.from = v;
  }
  get to(): Address {
    return this._props.to;
  }
  set to(v: Address) {
    this._props.to = v;
  }
  get cc(): Address {
    return this._props.cc;
  }
  set cc(v: Address) {
    this._props.cc = v;
  }
  get bcc(): Address {
    return this._props.bcc;
  }
  set bcc(v: Address) {
    this._props.bcc = v;
  }
  get date(): Date {
    return this._props.date;
  }
  set date(v: Date) {
    this._props.date = v;
  }
  get messageId(): string {
    return this._props.messageId;
  }
  set messageId(v: string) {
    this._props.messageId = v;
  }
  get inReplyTo(): string {
    return this._props.inReplyTo;
  }
  set inReplyTo(v: string) {
    this._props.inReplyTo = v;
  }
  get reply(): Address {
    return this._props.reply;
  }
  set reply(v: Address) {
    this._props.reply = v;
  }
  get references(): string | string[] {
    return this._props.references;
  }
  set references(v: string | string[]) {
    this._props.references = v;
  }
  get html(): string {
    return this._props.html;
  }
  set html(v: string) {
    this._props.html = v;
  }
  get text(): string {
    return this._props.text;
  }
  set text(v: string) {
    this._props.text = v;
  }
  get textAsHtml(): string {
    return this._props.textAsHtml;
  }
  set textAsHtml(v: string) {
    this._props.textAsHtml = v;
  }
  get attachments(): Attachment[] {
    return this._props.attachments;
  }
  set attachments(v: Attachment[]) {
    this._props.attachments = v;
  }
  get ownerAddress(): string {
    return this._props.ownerAddress;
  }
  set ownerAddress(v: string) {
    this._props.ownerAddress = v;
  }
}
