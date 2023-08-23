import "reflect-metadata";
import { Container } from "inversify";
import { UserRepository } from "./domain/service/user-repository";
import { TYPES } from "./types";
import { UserSqliteRepository } from "./infra/sqlite/user-sqlite-repository";
import { UserService } from "./app/user-service";
import { UserMongodbRepository } from "./infra/mongodb/user-mongodb-repository";

const container = new Container();
container.bind<UserRepository>(TYPES.UserRepository).to(UserSqliteRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);

export { container };
