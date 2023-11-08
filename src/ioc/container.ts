import "reflect-metadata";
import { Container } from "inversify";

// Symbols
import { TYPES } from "@/ioc/types";

// Main Lib
import type { Logger } from "@/common/libs/logger/logger";
import { ErrorHandler } from "@/common/libs/error-handler";

// Main Lib Implementation
import { WinstonLogger } from "@/common/libs/logger/winston-logger";

// Main Web Server
import { WebServer } from "@/presentation/web/web-server";
// import { SocketServer } from "@/presentation/web/socket/socket-server";
import { Routes } from "@/presentation/web/routes";

// REST Controller
import { AuthController } from "@/presentation/web/controllers/auth-controller";
import { UserController } from "@/presentation/web/controllers/user-controller";

// Socket Listener
// import { Listeners } from "@/presentation/web/socket/listeners";

// Infrastructures
// import { SQLiteDataSource } from "@/infra/sqlite/data-source";
import { MongoDBConnection } from "@/infra/mongodb/connection";

// Repository Interfaces
import { IUserRepository, IAuthRepository } from "@/domain/service";

// Repository Implementation
import {
  UserRepository,
  AuthRepository,
} from "@/infra/mongodb";
// import { UserRepository, AuthRepository } from "@/infra/sqlite/repositories";

// Services
import { UserService, AuthService } from "@/services";

const container = new Container({ skipBaseClassChecks: true });
// Main App Binding
container.bind<Logger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();
container.bind<ErrorHandler>(ErrorHandler).toSelf().inSingletonScope();
container.bind<WebServer>(WebServer).toSelf().inSingletonScope();
container.bind<Routes>(Routes).toSelf().inSingletonScope();
// container.bind<SocketServer>(SocketServer).toSelf().inSingletonScope();
// container.bind<Listeners>(Listeners).toSelf().inSingletonScope();

// REST Controller Binding
container.bind<AuthController>(AuthController).toSelf().inSingletonScope();
container.bind<UserController>(UserController).toSelf().inSingletonScope();

// Socket Listener Binding

// Infrastructure Binding
// container.bind<SQLiteDataSource>(SQLiteDataSource).toSelf().inSingletonScope();
container.bind<MongoDBConnection>(MongoDBConnection).toSelf().inSingletonScope();

// Repository Binding Sqlite
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();

// Service Bind
container.bind<AuthService>(AuthService).toSelf().inSingletonScope();
container.bind<UserService>(UserService).toSelf().inSingletonScope();

export { container };
