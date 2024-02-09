import { config } from "@/common/utils";
import { Address, Attachment, IEMail, Mail } from "@/domain/model/email";
import { WebmailBe } from "@/infra/webmail-be/webmail-be";
import { TYPES } from "@/ioc/types";
import axios from "axios";
import imap from "imap";
import { inject, injectable } from "inversify";
import { simpleParser } from "mailparser";
import { Logger } from "winston";
import fs from "fs-extra";
import path from "path";
export type IListener = {
  [key: string]: imap;
};
export type IEmailListener = {
  email: string;
  password: string;
  token: string;
};

@injectable()
export class EmailService {
  private listener: IListener = {};
  private emails: IEmailListener[] = [];
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(WebmailBe) private webmailBe: WebmailBe
  ) {
    try {
      const emails = <IEmailListener[]>fs.readJsonSync(path.join(config.storageDir, "emails.json"));
      emails.map((email) => {
        this.subscribe(email.email, email.password, email.token);
      });
    } catch (error) {
      fs.writeFileSync(path.join(config.storageDir, "emails.json"), "[]");
    }
  }
  subscribe(email: string, password: string, token: string) {
    this.listener[email] = new imap({
      user: email,
      password: password,
      host: config.imap.host,
      port: config.imap.port,
      tls: config.imap.tls,
    });
    this.listener[email].connect();
    this.listener[email].once("ready", () => {
      this.listener[email].getBoxes((err, mailbox) => {
        if (err) {
          console.error(err);
        } else {
          Object.keys(mailbox).forEach((boxName) => {
            const delimiter = mailbox[boxName].delimiter;
            this.listener[email].openBox(boxName, true, (err, box) => {
              if (err) {
                this.logger.error("error bolo", err);
              } else {
                const f = this.listener[email].fetch(box.messages.total + ":*", { bodies: "" });
                f.on("message", (msg, seqno) => {
                  msg.on("body", (stream) => {
                    // @ts-ignore
                    simpleParser(stream, async (err, parsed) => {
                      const { id, createdAt, updatedAt, ...save } = Mail.create({
                        headers: parsed.headers,
                        mailboxName: boxName.toUpperCase(),
                        subject: parsed.subject,
                        from: <Address>(<unknown>parsed.from),
                        to: <Address>(<unknown>parsed.to),
                        cc: <Address>(<unknown>parsed.cc),
                        bcc: <Address>(<unknown>parsed.bcc),
                        date: parsed.date,
                        messageId: parsed.messageId,
                        inReplyTo: parsed.inReplyTo,
                        reply: <Address>(<unknown>parsed.replyTo),
                        references: parsed.references,
                        html: parsed.html || "",
                        text: parsed.text,
                        textAsHtml: parsed.textAsHtml,
                        attachments: <Attachment[]>(<unknown>parsed.attachments),
                        ownerAddress: email,
                      }).unmarshall();
                      this.logger.info(`${boxName} => ${save.from.text}:${save.to.text}`);
                      this.webmailBe.save(save, token);
                    });
                  });
                });
              }
            });
            Object.keys(mailbox[boxName].children)
              .filter((item) => !["Archive", "Junk", "Drafts"].includes(item))
              .forEach((childName) => {
                const childBoxName = `${boxName}${delimiter}${childName}`;
                if (!this.listener[`${email}${childBoxName}`]) {
                  this.listener[`${email}${childBoxName}`] = new imap({
                    user: email,
                    password: password,
                    host: config.imap.host,
                    port: config.imap.port,
                    tls: config.imap.tls,
                  });
                  this.listener[`${email}${childBoxName}`].connect();
                  this.listener[`${email}${childBoxName}`].once("ready", () => {
                    this.listener[`${email}${childBoxName}`].openBox(
                      childBoxName,
                      true,
                      (err, box) => {
                        if (err) {
                          this.logger.error("error bolo", err);
                        } else {
                          const f = this.listener[`${email}${childBoxName}`].fetch(
                            box.messages.total + ":*",
                            { bodies: "" }
                          );
                          f.on("message", (msg, seqno) => {
                            msg.on("body", (stream) => {
                              // @ts-ignore
                              simpleParser(stream, async (err, parsed) => {
                                const { id, createdAt, updatedAt, ...save } = Mail.create({
                                  headers: parsed.headers,
                                  mailboxName: childName.toUpperCase(),
                                  subject: parsed.subject,
                                  from: <Address>(<unknown>parsed.from),
                                  to: <Address>(<unknown>parsed.to),
                                  cc: <Address>(<unknown>parsed.cc),
                                  bcc: <Address>(<unknown>parsed.bcc),
                                  date: parsed.date,
                                  messageId: parsed.messageId,
                                  inReplyTo: parsed.inReplyTo,
                                  reply: <Address>(<unknown>parsed.replyTo),
                                  references: parsed.references,
                                  html: parsed.html || "",
                                  text: parsed.text,
                                  textAsHtml: parsed.textAsHtml,
                                  attachments: <Attachment[]>(<unknown>parsed.attachments),
                                  ownerAddress: email,
                                }).unmarshall();
                                this.logger.info(
                                  `${childBoxName} => ${save.from.text}:${save.to.text}`
                                );
                                this.webmailBe.save(save, token);
                              });
                            });
                          });
                        }
                      }
                    );
                  });
                }
              });
          });
          this.listener[email].on("mail", (count) => {
            Object.keys(mailbox).forEach((boxName) => {
              const delimiter = mailbox[boxName].delimiter;
              this.listener[email].openBox(boxName, true, (err, box) => {
                if (err) {
                  this.logger.error("error bolo", err);
                } else {
                  const f = this.listener[email].fetch(box.messages.total + ":*", { bodies: "" });
                  f.on("message", (msg, seqno) => {
                    msg.on("body", (stream) => {
                      // @ts-ignore
                      simpleParser(stream, async (err, parsed) => {
                        const { id, createdAt, updatedAt, ...save } = Mail.create({
                          headers: parsed.headers,
                          mailboxName: boxName.toUpperCase(),
                          subject: parsed.subject,
                          from: <Address>(<unknown>parsed.from),
                          to: <Address>(<unknown>parsed.to),
                          cc: <Address>(<unknown>parsed.cc),
                          bcc: <Address>(<unknown>parsed.bcc),
                          date: parsed.date,
                          messageId: parsed.messageId,
                          inReplyTo: parsed.inReplyTo,
                          reply: <Address>(<unknown>parsed.replyTo),
                          references: parsed.references,
                          html: parsed.html || "",
                          text: parsed.text,
                          textAsHtml: parsed.textAsHtml,
                          attachments: <Attachment[]>(<unknown>parsed.attachments),
                          ownerAddress: email,
                        }).unmarshall();
                        this.logger.info(`${boxName} => ${save.from.text}:${save.to.text}`);
                        this.webmailBe.save(save, token);
                      });
                    });
                  });
                }
              });
              Object.keys(mailbox[boxName].children)
                .filter((item) => !["Archive", "Junk", "Drafts"].includes(item))
                .forEach((childName) => {
                  const childBoxName = `${boxName}${delimiter}${childName}`;
                  if (!this.listener[`${email}${childBoxName}`]) {
                    this.listener[`${email}${childBoxName}`] = new imap({
                      user: email,
                      password: password,
                      host: config.imap.host,
                      port: config.imap.port,
                      tls: config.imap.tls,
                    });
                    this.listener[`${email}${childBoxName}`].connect();
                    this.listener[`${email}${childBoxName}`].once("ready", () => {
                      this.listener[`${email}${childBoxName}`].openBox(
                        childBoxName,
                        true,
                        (err, box) => {
                          if (err) {
                            this.logger.error("error bolo", err);
                          } else {
                            const f = this.listener[`${email}${childBoxName}`].fetch(
                              box.messages.total + ":*",
                              { bodies: "" }
                            );
                            f.on("message", (msg, seqno) => {
                              msg.on("body", (stream) => {
                                // @ts-ignore
                                simpleParser(stream, async (err, parsed) => {
                                  const { id, createdAt, updatedAt, ...save } = Mail.create({
                                    headers: parsed.headers,
                                    mailboxName: childName.toUpperCase(),
                                    subject: parsed.subject,
                                    from: <Address>(<unknown>parsed.from),
                                    to: <Address>(<unknown>parsed.to),
                                    cc: <Address>(<unknown>parsed.cc),
                                    bcc: <Address>(<unknown>parsed.bcc),
                                    date: parsed.date,
                                    messageId: parsed.messageId,
                                    inReplyTo: parsed.inReplyTo,
                                    reply: <Address>(<unknown>parsed.replyTo),
                                    references: parsed.references,
                                    html: parsed.html || "",
                                    text: parsed.text,
                                    textAsHtml: parsed.textAsHtml,
                                    attachments: <Attachment[]>(<unknown>parsed.attachments),
                                    ownerAddress: email,
                                  }).unmarshall();
                                  this.logger.info(
                                    `${childBoxName} => ${save.from.text}:${save.to.text}`
                                  );
                                  this.webmailBe.save(save, token);
                                });
                              });
                            });
                          }
                        }
                      );
                    });
                  }
                });
            });
          });
        }
      });
    });
    this.listener[email].once("error", (err) => {
      process.exit(0);
    });
    this.emails = this.emails.filter((item) => item.email !== email);
    this.emails.push({
      email: email,
      password: password,
      token: token,
    });
    fs.writeFileSync(path.join(config.storageDir, "emails.json"), JSON.stringify(this.emails));
  }
}
