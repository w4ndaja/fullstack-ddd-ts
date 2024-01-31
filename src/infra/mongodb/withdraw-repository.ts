import { IWithdrawRepository } from "@/domain/service";
import { Repository } from "./repository";
import { IWithdraw } from "@/domain/model/withdraw";
import { inject } from "inversify";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";

export class WithdrawRepository extends Repository<IWithdraw> implements IWithdrawRepository {
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("withdraws");
  }
  async findAllByUserId(userId: string): Promise<IWithdraw[]> {
    const mongo = await this.collection.find({ userId }, { sort: { createdAt: -1 } });
    const withdraws: IWithdraw[] = (await mongo.toArray()).map(
      ({ _id, ...item }) => <IWithdraw>item
    );
    return withdraws;
  }
}
