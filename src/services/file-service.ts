import { Logger } from "@/common/libs/logger";
import { File, IFile, IFileCreate } from "@/domain/model/file";
import { IFileRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class FileService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.FileRepository) private fileRepository: IFileRepository
  ) {}
  public async upload(files: IFileCreate[]): Promise<IFile[]> {
    const filesDto: IFile[] = await Promise.all(
      files.map(async (file) => {
        const fileEntity = File.create(file);
        let fileDto = fileEntity.unmarshall();
        return await this.fileRepository.save(fileDto);
      })
    );
    this.logger.info("service", filesDto);
    return filesDto;
  }
  public remove(files: IFileCreate[]): void {
    this.fileRepository.removeTemp(files);
  }
}
