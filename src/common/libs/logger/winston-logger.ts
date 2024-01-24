import "reflect-metadata";
import { injectable } from "inversify";
import winston from "winston";
import type { Logger } from "./logger";
import path from "path";
import { config } from "@/common/utils";
import DailyRotateFile from "winston-daily-rotate-file";
import { AppError } from "../error-handler";
@injectable()
export class WinstonLogger implements Logger {
  private logger: winston.Logger;
  constructor() {
    const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    });
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            myFormat
          ),
        }),
        new DailyRotateFile({
          filename: path.join(config.storageDir, "logs/log"),
          level: "info",
          format: winston.format.combine(winston.format.timestamp(), myFormat),
        }),
      ],
    });
  }
  error(...obj: unknown[]): void {
    this.logger.error(this.mapToString(obj));
  }
  warn(...obj: unknown[]): void {
    this.logger.warn(this.mapToString(obj));
  }
  info(...obj: unknown[]): void {
    this.logger.info(this.mapToString(obj));
  }
  http(...obj: unknown[]): void {
    this.logger.http(this.mapToString(obj));
  }
  verbose(...obj: unknown[]): void {
    this.logger.verbose(this.mapToString(obj));
  }
  debug(...obj: unknown[]): void {
    this.logger.debug(this.mapToString(obj));
  }
  silly(...obj: unknown[]): void {
    this.logger.silly(this.mapToString(obj));
  }
  public getWinston(): winston.Logger {
    return this.logger;
  }
  private mapToString(item: unknown[]) {
    return item.map((item) => {
      if (item instanceof AppError || typeof item === "string") {
        return item;
      } else {
        try {
          return JSON.stringify(item, null, 4);
        } catch (error) {
          return item
        }
      }
    }).join("\n");
  }
}
