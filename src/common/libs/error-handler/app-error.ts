import { ErrorCode } from "@/common/utils/error-code";
export type IAppError = {
  statusCode: ErrorCode;
  message: string;
  data?: object;
  stack?: string;
};
export class AppError extends Error {
  name: string = "AppError";
  code: ErrorCode;
  message: string;
  data?: object;
  constructor(errorCode: ErrorCode, message: string, data?: object | any) {
    super(message);
    this.code = errorCode;
    this.message = message;
    this.data = data;
    Error.captureStackTrace(this);
  }
  public toJson(): IAppError {
    return {
      statusCode: this.code,
      message: this.message,
      data: this.data,
    };
  }
}
