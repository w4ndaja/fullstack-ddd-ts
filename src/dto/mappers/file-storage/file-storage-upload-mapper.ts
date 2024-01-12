import { IFileStorageCreate } from "@/domain/model/file-storage";

export class FileStorageUploadMapper{
  static fromMulterToDto(file:Express.Multer.File):IFileStorageCreate{
    return {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
    }
  }
}