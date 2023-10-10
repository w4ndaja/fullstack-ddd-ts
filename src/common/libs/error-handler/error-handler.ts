import type { Logger } from "@/common/libs/logger/logger";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";

@injectable()
export class ErrorHandler {
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    process.on("uncaughtException", (e) => {
      this.logger.error(e);
    });
    process.on("unhandledRejection", (e) => {
      this.logger.error(e);
    });
  }
  public handleError(error: AppError | Error): AppError {
    if (error.name === "AppError") {
      return this.handleTrustedError(<AppError>error);
    } else {
      return this.handleUntrustedError(error);
    }
  }
  public handleTrustedError(error: AppError): AppError {
    this.logger.error(error.toJson(), error.stack);
    return error;
  }
  public handleUntrustedError(error: Error): AppError {
    this.logger.error(error, error.stack);
    return new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
}
