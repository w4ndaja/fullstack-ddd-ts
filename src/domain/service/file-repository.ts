import { IFile, IFileCreate } from "../model/file";
import { IRepository } from "./repository";

export interface IFileRepository extends IRepository<IFile> {
  removeTemp(files: IFileCreate[]): void;
}
