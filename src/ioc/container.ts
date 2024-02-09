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
import { EmailController } from "@/presentation/web/controllers/email-controller";

// REST Middleware
import { AuthMiddleware } from "@/presentation/web/middlewares/auth-middleware";

// Socket Listener
// import { Listeners } from "@/presentation/web/socket/listeners";

// Infrastructures
// import { SQLiteDataSource } from "@/infra/sqlite/data-source";
import { MongoDBConnection } from "@/infra/mongodb/connection";
import { WebmailBe } from "@/infra/webmail-be/webmail-be";

// Repository Interfaces
import { IUserRepository } from "@/domain/service/user-repository";
import { IAuthRepository } from "@/domain/service/auth-repository";

// Repository Implementation
import { UserRepository } from "@/infra/mongodb/user-repository";
import { AuthRepository } from "@/infra/mongodb/auth-repository";

// Services
import { UserService } from "@/services/user-service";
import { AuthService } from "@/services/auth-service";
import { EmailService } from "@/services/email-service";

const container = new Container({ skipBaseClassChecks: true });
// Main App Binding
container.bind<Logger>(TYPES.Logger).to(WinstonLogger);
container.bind<ErrorHandler>(ErrorHandler).toSelf().inSingletonScope();
container.bind<WebServer>(WebServer).toSelf().inSingletonScope();
container.bind<Routes>(Routes).toSelf().inSingletonScope();
// container.bind<SocketServer>(SocketServer).toSelf().inSingletonScope();
// container.bind<Listeners>(Listeners).toSelf().inSingletonScope();

// REST Controller Binding
container.bind<AuthController>(AuthController).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<EmailController>(EmailController).toSelf();

// REST Middleware Binding
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

// Socket Listener Binding

// Infrastructure Binding
// container.bind<SQLiteDataSource>(SQLiteDataSource).toSelf().inSingletonScope();
container.bind<MongoDBConnection>(MongoDBConnection).toSelf().inSingletonScope();
container.bind<WebmailBe>(WebmailBe).toSelf().inSingletonScope();

// Repository Binding Sqlite
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);

// Service Bind
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<EmailService>(EmailService).toSelf();

export { container };
