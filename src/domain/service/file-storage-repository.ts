import { IFileStorage, IFileStorageCreate } from "../model/file-storage";
import { IRepository } from "./repository";

export interface IFileStorageRepository extends IRepository<IFileStorage> {
  removeTemp(files: IFileStorageCreate[]): void;
}
