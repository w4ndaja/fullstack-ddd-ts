import { Entity, IEntity } from "./entity";

export type IGAuthDecoded = {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
};

interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

interface Identities {
  "google.com": string[];
  email: string[];
}

export class GAuthDecoded extends Entity<IGAuthDecoded> {
  constructor(props) {
    super(props);
  }
  public static create(props) {
    return new GAuthDecoded(props);
  }
  public unmarshall(): IEntity<IGAuthDecoded> {
    return {
      ...super.unmarshall(),
    };
  }

  get name(): string {
    return this._props.name;
  }
  set name(v: string) {
    this._props.name = v;
  }
  get picture(): string {
    return this._props.picture;
  }
  set picture(v: string) {
    this._props.picture = v;
  }
  get iss(): string {
    return this._props.iss;
  }
  set iss(v: string) {
    this._props.iss = v;
  }
  get aud(): string {
    return this._props.aud;
  }
  set aud(v: string) {
    this._props.aud = v;
  }
  get auth_time(): number {
    return this._props.auth_time;
  }
  set auth_time(v: number) {
    this._props.auth_time = v;
  }
  get user_id(): string {
    return this._props.user_id;
  }
  set user_id(v: string) {
    this._props.user_id = v;
  }
  get sub(): string {
    return this._props.sub;
  }
  set sub(v: string) {
    this._props.sub = v;
  }
  get iat(): number {
    return this._props.iat;
  }
  set iat(v: number) {
    this._props.iat = v;
  }
  get exp(): number {
    return this._props.exp;
  }
  set exp(v: number) {
    this._props.exp = v;
  }
  get email(): string {
    return this._props.email;
  }
  set email(v: string) {
    this._props.email = v;
  }
  get email_verified(): boolean {
    return this._props.email_verified;
  }
  set email_verified(v: boolean) {
    this._props.email_verified = v;
  }
  get firebase(): Firebase {
    return this._props.firebase;
  }
  set firebase(v: Firebase) {
    this._props.firebase = v;
  }
}
