import { Logger } from "@/common/libs/logger";
import { config } from "@/common/utils";
import { IEMail } from "@/domain/model/email";
import { TYPES } from "@/ioc/types";
import axios, { Axios } from "axios";
import { inject, injectable } from "inversify";

@injectable()
export class WebmailBe {
  private axios: Axios;
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.axios = axios.create({
      baseURL: config.webmailBe.baseUrl,
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzRlZTg0YTczMzNlZWQyNjQwNzc5NiIsInVzZXJuYW1lIjoiYW5uYXMiLCJlbWFpbCI6ImFubmFzQHJleGhvc3Rlci5pZCIsImlhdCI6MTcwNzQwNDkzMiwiZXhwIjoxNzA3NDQ4MTMyfQ.seouL8lbrkXDiVInQz9q4w5YoF4NXXUL1Jjx_Ankv9Y",
      },
    });
  }
  async save(email: Partial<IEMail>, token: string): Promise<void> {
    this.axios.post("/mail", { mail: email }, { headers: { Authorization: token } });
  }
}
