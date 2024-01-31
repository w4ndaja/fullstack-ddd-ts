import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { ErrorCode } from "@/common/utils";
import { EWithdrawStatus } from "@/common/utils/withdraw-status";
import { Wallet } from "@/domain/model/wallet";
import { Withdraw } from "@/domain/model/withdraw";
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
    let walletDto = await this.walletRepository.findByUserId(userId);
    let walletEntity = Wallet.create(walletDto);
    let withdrawEntity = Withdraw.create({
      userId: userId,
      status: EWithdrawStatus.PENDING.toString(),
    });
    walletEntity.withdraw(amount);
    let withdrawDto = withdrawEntity.unmarshall();
    walletDto = walletEntity.unmarshall();
    await Promise.all([
      this.walletRepository.save(walletDto),
      this.withdrawRepository.save(withdrawDto),
    ]);
    return withdrawDto;
  }
  public async history(userId: string) {
    let withdrawsDto = await this.withdrawRepository.findAllByUserId(userId);
    let withdrawsEntity = withdrawsDto.map((item) => Withdraw.create(item));
    return withdrawsEntity;
  }
  public async process(withdrawId: string) {
    let withdrawDto = await this.withdrawRepository.findById(withdrawId);
    let withdrawEntity = Withdraw.create(withdrawDto);
    if (withdrawEntity.status !== EWithdrawStatus.PENDING)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status not pending");
    withdrawEntity.status = EWithdrawStatus.INPROGRESS;
    withdrawDto = withdrawEntity.unmarshall();
    await this.withdrawRepository.save(withdrawDto);
    return withdrawDto;
  }
  public async finish(withdrawId: string) {
    let withdrawDto = await this.withdrawRepository.findById(withdrawId);
    let withdrawEntity = Withdraw.create(withdrawDto);
    if (withdrawEntity.status !== EWithdrawStatus.INPROGRESS)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status not in progress");
    withdrawEntity.status = EWithdrawStatus.SUCCESS;
    withdrawDto = withdrawEntity.unmarshall();
    await this.withdrawRepository.save(withdrawDto);
    return withdrawDto;
  }
  public async reject(withdrawId: string) {
    let withdrawDto = await this.withdrawRepository.findById(withdrawId);
    let withdrawEntity = Withdraw.create(withdrawDto);
    if (withdrawEntity.status === EWithdrawStatus.SUCCESS)
      throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "Status is Success, Can't be rejected");
    withdrawEntity.status = EWithdrawStatus.SUCCESS;
    withdrawDto = withdrawEntity.unmarshall();
    await this.withdrawRepository.save(withdrawDto);
    return withdrawDto;
  }
}
