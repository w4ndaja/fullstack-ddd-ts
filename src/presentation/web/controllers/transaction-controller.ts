import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { TransactionService } from "@/services";
import { INotifAkulaku } from "@/infra/midtrans/notification/model/akulaku";
import { INotifAlfamart } from "@/infra/midtrans/notification/model/alfamart";
import { INotifBcaVa } from "@/infra/midtrans/notification/model/bca-va";
import { INotifBniVa } from "@/infra/midtrans/notification/model/bni-va";
import { INotifBriVa } from "@/infra/midtrans/notification/model/bri-va";
import { INotifCard } from "@/infra/midtrans/notification/model/card";
import { INotifGopay } from "@/infra/midtrans/notification/model/gopay";
import { INotifIndomaret } from "@/infra/midtrans/notification/model/indomaret";
import { INotifMandiriBill } from "@/infra/midtrans/notification/model/mandiri-bill";
import { INotifPermataVa } from "@/infra/midtrans/notification/model/permata-va";
import { INotifQris } from "@/infra/midtrans/notification/model/qris";
import { INotifShoopePay } from "@/infra/midtrans/notification/model/shoope-pay";
import { RestMapper } from "@/dto/mappers/rest-mapper";

@injectable()
export class TransactionController extends Router {
  constructor(@inject(TransactionService) private transactionService: TransactionService) {
    super("/transactions");
    this.routes.post("/notification", asyncWrapper(this.notification.bind(this)));
  }
  private async notification(req: Request, res: Response, next: NextFunction) {
    const notification = req.body;
    const result = await this.transactionService.notification(
      <
        | INotifAkulaku
        | INotifAlfamart
        | INotifBcaVa
        | INotifBniVa
        | INotifBriVa
        | INotifCard
        | INotifGopay
        | INotifIndomaret
        | INotifMandiriBill
        | INotifPermataVa
        | INotifQris
        | INotifShoopePay
      >notification
    );
    res.json(RestMapper.dtoToRest(result));
  }
}
