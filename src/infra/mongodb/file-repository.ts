import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { IFile, IFileCreate } from "@/domain/model/file";
import { IFileRepository } from "@/domain/service/file-repository";
import fsExtra from "fs-extra";
import { Logger } from "@/common/libs/logger";
import { TYPES } from "@/ioc/types";
import path from "path";
import { config } from "@/common/utils";

@injectable()
export class FileRepository extends Repository<IFile> implements IFileRepository {
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("files");
    fsExtra.ensureDir(path.join(config.storageDir, "public"));
  }
  async save(_data: Partial<IFile>): Promise<IFile> {
    let data = <IFile>{ ..._data };
    const newFileName = `${data.id}.${data.originalname.split(".").reverse()[0]}`;
    const newPath = path.join(config.storageDir, `public/${newFileName}`);
    await fsExtra.copyFile(data.path, newPath);
    data.filename = newFileName;
    data.path = newPath;
    this.collection.insertOne(data);
    return <IFile>data;
  }
  public removeTemp(files: IFileCreate[]): void {
    files.forEach((file) => {
      try {
        fsExtra.remove(file.path);
      } catch (e) {}
    });
  }
}
