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
import { LiveTrainingBook } from "@/domain/model/live-training-book";
import { ITransaction, ITransactionCreate, Transaction } from "@/domain/model/transaction";
import {
  IBookRepository,
  ILiveTrainingBookRepository,
  ITransactionRepository,
} from "@/domain/service";
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
    @inject(Midtrans) private midtrans: Midtrans,
    @inject(TYPES.LiveTrainingBookRepository)
    private liveTrainingBookRepository: ILiveTrainingBookRepository
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
    this.logger.info(`Midtrans trying to find transaction with order_id ${notification.order_id}`);
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
    let liveTrainingBookDto = await this.liveTrainingBookRepository.findById(notification.order_id);
    if (!bookDto && !liveTrainingBookDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Order Not Found");
    }
    const bookEntity = bookDto ? Book.create(bookDto) : undefined;
    const liveTrainingBookEntity = liveTrainingBookDto
      ? LiveTrainingBook.create(liveTrainingBookDto)
      : undefined;

    switch (notification.transaction_status) {
      case "settlement":
      case "capture":
        if (bookEntity) bookEntity.setPaid();
        if (liveTrainingBookEntity) liveTrainingBookEntity.setPaid();
        break;
      case "pending":
        if (bookEntity)
          bookEntity.payment = { ...bookEntity.payment, status: PaymentStatus.PENDING.toString() };
        if (liveTrainingBookEntity)
          liveTrainingBookEntity.payment = {
            ...liveTrainingBookEntity.payment,
            status: PaymentStatus.PENDING.toString(),
          };
        break;
      default:
        if (bookEntity)
          bookEntity.payment = { ...bookEntity.payment, status: PaymentStatus.FAILED.toString() };
        if (liveTrainingBookEntity)
          liveTrainingBookEntity.payment = {
            ...liveTrainingBookEntity.payment,
            status: PaymentStatus.FAILED.toString(),
          };
        break;
    }
    if (bookDto) bookDto = bookEntity.unmarshall();
    if (liveTrainingBookDto) liveTrainingBookDto = liveTrainingBookEntity.unmarshall();
    if (bookDto) await this.bookRepository.save(bookDto);
    if (liveTrainingBookDto) await this.liveTrainingBookRepository.save(liveTrainingBookDto);
    await this.transactionRepository.save(transactionDto);
    axios
      .post("https://api-v2.camy.id/api/midtrans/notification-handling", notification)
      .catch((e) =>
        this.logger.error("Failed to forward midtrans notification to Camy OLD", e.response)
      );
    transactionDto = transaction.unmarshall();
    return transactionDto;
  }
}
