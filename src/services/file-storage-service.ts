import { Logger } from "@/common/libs/logger";
import { Auth, IAuth } from "@/domain/model";
import { FileStorage, IFileStorage, IFileStorageCreate } from "@/domain/model/file-storage";
import { IFileStorageRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class FileStorageService {
  private auth: Auth;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.FileStorageRepository) private fileRepository: IFileStorageRepository
  ) {}
  public async upload(files: IFileStorageCreate[]): Promise<IFileStorage[]> {
    const filesDto: IFileStorage[] = await Promise.all(
      files.map(async (file) => {
        const fileEntity = FileStorage.create(file);
        let fileDto = fileEntity.unmarshall();
        return await this.fileRepository.save(fileDto);
      })
    );
    return filesDto;
  }
  public remove(files: IFileStorageCreate[]): void {
    this.fileRepository.removeTemp(files);
  }
  public setAuth(auth: IAuth) {
    this.auth = Auth.create(auth);
  }
}
