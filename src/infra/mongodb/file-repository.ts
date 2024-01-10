import { injectable } from "inversify";
import { Repository } from "./repository";
import { IFile } from "@/domain/model/file";
import { IFileRepository } from "@/domain/service/file-repository";
import fsExtra from 'fs-extra'

@injectable()
export class FileRepository extends Repository<IFile> implements IFileRepository {
  constructor() {
    super("files");
  }
  async save(_data: Partial<IFile>): Promise<IFile> {
    const data = <IFile>{ ..._data };
    const checkExist = await this.collection.findOne({ id: data.id });
    if (checkExist?._id) {
      await Promise.all([this.collection.updateOne(
        { id: data.id },
        {
          $set: data,
        }
      ), (async () => {
        const fileExists = await fsExtra.readFile(data.path)
      })()])
    } else {
      await this.collection.insertOne(data);
    }
    const { _id, ...__data } = <any>data;
    return <IFile>__data;
  }
}
