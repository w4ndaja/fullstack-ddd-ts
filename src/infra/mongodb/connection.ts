import type { Logger } from "@/common/libs/logger/logger";
import { config } from "@/common/utils/config";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { Db, MongoClient } from "mongodb";

@injectable()
export class MongoDBConnection {
  private dbName: string;
  public database: Db;
  public mongoClient: MongoClient;
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.mongoClient = new MongoClient(config.connection.mongodb.uri);
    this.dbName = config.connection.mongodb.dbName;
    this.database = this.mongoClient.db(this.dbName);
  }
}
