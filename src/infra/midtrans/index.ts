import { config } from "@/common/utils";
import axios, { Axios } from "axios";
import { injectable } from "inversify";
import midtransClient from "midtrans-client";

@injectable()
export class Midtrans {
  private snap: typeof midtransClient;
  private env: "PRODUCTION" | "SANDBOX";
  private authString: string;
  constructor() {
    this.env = <"PRODUCTION" | "SANDBOX">config.midtrans.env;
    this.authString = Buffer.from(
      `${
        this.env == "PRODUCTION"
          ? config.midtrans.serverKeyProduction
          : config.midtrans.serverKeySandbox
      }:`,
      "base64"
    ).toString();
    this.snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: this.env == "PRODUCTION",
      serverKey: this.env === "PRODUCTION" ? config.midtrans.serverKeyProduction : config.midtrans.serverKeySandbox,
    });
  }
}
