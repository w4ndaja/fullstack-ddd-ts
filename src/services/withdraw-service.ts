import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { EWithdrawStatus } from "@/common/utils/withdraw-status";
import { Wallet } from "@/domain/model/wallet";
import { IWithdraw, Withdraw } from "@/domain/model/withdraw";
import { IWalletRepository, IWithdrawRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class WithdrawService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.WithdrawRepository) private withdrawRepository: IWithdrawRepository,
    @inject(TYPES.WalletRepository) private walletRepository: IWalletRepository
  ) {}
  public async requestWithdraw(userId: string, amount: number) {
    let wallet = Wallet.create(await this.walletRepository.findByUserId(userId));
    if (wallet.balance < amount) {
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Insufficient balance");
    }
    let withdraw = Withdraw.create({
      userId: userId,
      status: EWithdrawStatus.PENDING.toString(),
      amount,
    });
    let withdrawDto = withdraw.unmarshall();
    await Promise.all([this.withdrawRepository.save(withdrawDto)]);
    return withdrawDto;
  }
  public async history(userId: string) {
    let withdrawsDto = await this.withdrawRepository.findAllByUserId(userId);
    let withdraws = withdrawsDto.map((item) => Withdraw.create(item));
    withdrawsDto = withdraws.map((item) => item.unmarshall());
    return withdrawsDto;
  }
  public async process(withdrawId: string) {
    let withdraw = Withdraw.create(await this.withdrawRepository.findById(withdrawId));

    if (withdraw.status !== EWithdrawStatus.PENDING)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status not pending");

    let wallet = Wallet.create(await this.walletRepository.findByUserId(withdraw.userId));

    withdraw.status = EWithdrawStatus.INPROGRESS;
    wallet.withdraw(withdraw.amount);

    const walletDto = wallet.unmarshall();
    const withdrawDto = withdraw.unmarshall();

    await Promise.all([
      this.walletRepository.save(walletDto),
      this.withdrawRepository.save(withdrawDto),
    ]);
    return withdrawDto;
  }
  public async finish(withdrawId: string) {
    let withdraw = Withdraw.create(await this.withdrawRepository.findById(withdrawId));

    if (withdraw.status !== EWithdrawStatus.INPROGRESS)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status not in progress");

    withdraw.status = EWithdrawStatus.SUCCESS;

    const withdrawDto = await this.withdrawRepository.save(withdraw.unmarshall());
    return withdrawDto;
  }
  public async reject(withdrawId: string) {
    let withdraw = Withdraw.create(await this.withdrawRepository.findById(withdrawId));
    let wallet = Wallet.create(await this.walletRepository.findByUserId(withdraw.userId));

    if (withdraw.status === EWithdrawStatus.SUCCESS)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status is Success, Can't be rejected");
    if (withdraw.status === EWithdrawStatus.INPROGRESS) {
      wallet.refund(withdraw.amount);
    }
    withdraw.status = EWithdrawStatus.REJECT;

    const [withdrawDto, walletDto] = await Promise.all([
      this.withdrawRepository.save(withdraw.unmarshall()),
      this.walletRepository.save(wallet.unmarshall()),
    ]);
    return withdrawDto;
  }
}
