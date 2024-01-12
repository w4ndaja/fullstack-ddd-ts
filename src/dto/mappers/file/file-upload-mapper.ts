import { IFileCreate } from "@/domain/model/file";

export class FileUploadMapper{
  static fromMulterToDto(file:Express.Multer.File):IFileCreate{
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