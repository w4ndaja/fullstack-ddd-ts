import { Logger } from "@/common/libs/logger";
import { config } from "@/common/utils";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import nodemailer from "node-mailer";

@injectable()
export class CamyMail {
  private nodemailer;
  private _from: string;
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.nodemailer = nodemailer.createTransport({
      host: config.camy.email.host,
      port: 465,
      secure: true,
      auth: {
        user: config.camy.email.username,
        pass: config.camy.email.password,
      },
    });
  }
  public async send(to: string, subject: string, body: string) {
    const info = this.nodemailer.sendMail({
      from: `${this.from}`,
      to: to,
      subject: subject,
      html: body,
    });
    this.logger.info("Message sent: ", info.messageId);
  }
  public get from(): string {
    return this._from || '"CAMY" <info@camy.id>';
  }
}
