import type { Logger } from "@/common/libs/logger";
import { config } from "@/common/utils/config";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { DataSource } from "typeorm";
import { User, Auth } from "./models";
import { InitialAuth1694434591472, InitialUser1693898890740 } from "./migrations";

@injectable()
export class SQLiteDataSource {
  datasource: DataSource;
  waitUntilInitialized: Promise<Boolean>;
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.datasource = new DataSource({
      type: "sqlite",
      database: config.connection.sqlite.database,
      entities: [Auth, User],
      migrations: [InitialAuth1694434591472, InitialUser1693898890740],
    });
    this.waitUntilInitialized = new Promise((res, rej) => {
      this.datasource
        .initialize()
        .then((dataSource) => {
          this.datasource = dataSource;
          res(true);
        })
        .catch((reason) => {
          rej(reason);
        });
    });
  }
}
