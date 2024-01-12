import { inject, injectable } from "inversify";
import { Repository } from "./repository";
import { IFileStorage, IFileStorageCreate } from "@/domain/model/file-storage";
import { IFileStorageRepository } from "@/domain/service/file-storage-repository";
import fsExtra from "fs-extra";
import { Logger } from "@/common/libs/logger";
import { TYPES } from "@/ioc/types";
import path from "path";
import { config } from "@/common/utils";
import { Document } from "mongodb";

@injectable()
export class FileStorageRepository extends Repository<IFileStorage> implements IFileStorageRepository {
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    super("files");
    fsExtra.ensureDir(path.join(config.storageDir, "public"));
  }
  async save(_data: Partial<IFileStorage>): Promise<IFileStorage> {
    let data = <IFileStorage>{ ..._data };
    const newFileName = `${data.id}.${data.originalname.split(".").reverse()[0]}`;
    const newPath = path.join(config.storageDir, `public/${newFileName}`);
    await fsExtra.copyFile(data.path, newPath);
    data.filename = newFileName;
    data.path = newPath;
    this.collection.insertOne(data);
    const {_id, ...__data} = <Document>data
    return <IFileStorage>__data;
  }
  public removeTemp(files: IFileStorageCreate[]): void {
    files.forEach((file) => {
      try {
        fsExtra.remove(file.path);
      } catch (e) {}
    });
  }
}
