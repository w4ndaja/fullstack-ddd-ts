import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import {
  GenericPaginatedData,
  IBaseGetParam,
  IGenericPaginatedData,
} from "@/common/libs/pagination";
import { ErrorCode, config } from "@/common/utils";
import { PaymentStatus } from "@/common/utils/payment-status";
import { Book } from "@/domain/model/book";
import { ITransaction, ITransactionCreate, Transaction } from "@/domain/model/transaction";
import { IBookRepository, ITransactionRepository } from "@/domain/service";
import { Midtrans } from "@/infra/midtrans";
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
import { TYPES } from "@/ioc/types";
import axios from "axios";
import { inject, injectable } from "inversify";
import jsCrypto from "js-sha512";

@injectable()
export class TransactionService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.TransactionRepository) private transactionRepository: ITransactionRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository,
    @inject(Midtrans) private midtrans: Midtrans
  ) {}
  public async findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<ITransaction>> {
    const transactionsDto = await this.transactionRepository.findAll(param);
    const transaction = GenericPaginatedData.create(transactionsDto);
    return transaction.unmarshall();
  }
  public async createTransaction(transaction: ITransactionCreate): Promise<ITransaction> {
    let transactionEntity = Transaction.create(transaction);
    let transactionDto = transactionEntity.unmarshall();
    transactionDto = await this.transactionRepository.createTransaction(transactionDto);
    transactionEntity = Transaction.create(transactionDto);
    return transactionEntity.unmarshall();
  }
  public async notification(
    notification:
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
  ): Promise<ITransaction> {
    let transactionDto = await this.transactionRepository.findByOrderId(notification.order_id);
    if (!transactionDto) throw new AppError(ErrorCode.NOT_FOUND, "Order Not Found!");
    const transaction = Transaction.create(transactionDto);
    const ourSignature = jsCrypto.sha512(
      `${notification.order_id}${notification.status_code}${notification.gross_amount}${this.midtrans.serverKey}`
    );
    if (ourSignature !== notification.signature_key) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized!");
    }
    transaction.notification = notification;
    let bookDto = await this.bookRepository.findByOrderId(notification.order_id);
    if (!bookDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Order Not Found");
    }
    const bookEntity = Book.create(bookDto);
    switch (notification.transaction_status) {
      case "settlement":
      case "capture":
        bookEntity.setPaid();
        break;
      case "pending":
        bookEntity.payment = { ...bookEntity.payment, status: PaymentStatus.PENDING.toString() };
        break;
      default:
        bookEntity.payment = { ...bookEntity.payment, status: PaymentStatus.FAILED.toString() };
        break;
    }
    bookDto = bookEntity.unmarshall();
    await this.bookRepository.save(bookDto);
    await this.transactionRepository.save(transactionDto);
    axios.post("https://api-v2.camy.id/api/midtrans/notification-handling", notification);
    transactionDto = transaction.unmarshall();
    return transactionDto;
  }
}
