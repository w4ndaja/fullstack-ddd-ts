import { inject, injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { NextFunction, Request, Response } from "express";
import { TYPES } from "@/ioc/types";
import { Logger } from "@/common/libs/logger";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import multer from "multer";
import path from "path";
import { config } from "@/common/utils";
import { FileStorageService } from "@/services";
import { arrayMapper } from "@/common/libs/array-mapper";
import { FileStorageUploadMapper } from "@/dto/mappers/file-storage/file-storage-upload-mapper";

@injectable()
export class FileStorageController extends Router {
  private multerUploader = multer({ dest: path.join(config.storageDir, "temp") });
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(FileStorageService) private fileService: FileStorageService
  ) {
    super("/storage");
    this.routes.post(
      "/upload",
      asyncWrapper(this.authMiddleware.authenticated.bind(this.authMiddleware)),
      this.multerUploader.any(),
      asyncWrapper(this.upload.bind(this)),
      asyncWrapper(this.removeTemp.bind(this))
    );
  }
  private async upload(req: Request, res: Response, next: NextFunction) {
    const files = <Express.Multer.File[]>req.files;
    const result = await this.fileService.upload(
      arrayMapper(files, FileStorageUploadMapper.fromMulterToDto)
    );
    res.json(
      RestMapper.dtoToRest(
        result.map((item) => `${req.protocol}://${req.headers.host}/storage/${item.filename}`)
      )
    );
    next();
  }
  private async removeTemp(req: Request, res: Response, next: NextFunction) {
    const files = <Express.Multer.File[]>req.files;
    this.fileService.remove(
      files.map((file) => ({
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
      }))
    );
  }
}
