import { IBaseGetParam, IGenericPaginatedData } from "@/common/libs/pagination";
import { injectable } from "inversify";
import { FirebaseAdmin } from ".";
import { IUserRepository } from "@/domain/service";
import { IUser } from "@/domain/model";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private firebaseAdmin: FirebaseAdmin) {}
  findByUsernameOrEmail(username: string): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  onChange(callback: (user: IUser) => void): void {
    this.firebaseAdmin.db.collection("users").onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        callback(<IUser>change.doc.data());
      });
    });
  }
  findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<IUser>> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  save(data: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}
