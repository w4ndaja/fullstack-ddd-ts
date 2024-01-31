import { IWithdraw } from "../model/withdraw";
import { IRepository } from "./repository";

export interface IWithdrawRepository extends IRepository<IWithdraw> {
  findAllByUserId(userId:string):Promise<IWithdraw[]>
}
