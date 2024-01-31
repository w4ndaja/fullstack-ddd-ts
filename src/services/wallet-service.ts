import { Logger } from "@/common/libs/logger";
import { Wallet } from "@/domain/model/wallet";
import { IWalletRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class WalletService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.WalletRepository) private walletRepository: IWalletRepository
  ) {}
  public async findByUserId(userId: string) {
    let walletDto = await this.walletRepository.findByUserId(userId);
    let walletEntity = Wallet.create(walletDto);
    walletDto = walletEntity.unmarshall();
    return walletDto;
  }
}
