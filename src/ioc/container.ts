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
import { MentorController } from "@/presentation/web/controllers/mentor-controller";
import { BookController } from "@/presentation/web/controllers/book-controller";
import { BannerController } from "@/presentation/web/controllers/banner-controller";

// REST Middleware
import { AuthMiddleware } from "@/presentation/web/middlewares/auth-middleware";

// Socket Listener
// import { Listeners } from "@/presentation/web/socket/listeners";

// Infrastructures
// import { SQLiteDataSource } from "@/infra/sqlite/data-source";
import { MongoDBConnection } from "@/infra/mongodb/connection";

// Repository Interfaces
import {
  IUserRepository,
  IAuthRepository,
  IBookRepository,
  IMentorRepository,
  IParticipantRepository,
  IBannerRepository,
} from "@/domain/service";

// Repository Implementation
import {
  UserRepository,
  AuthRepository,
  BookRepository,
  MentorRepository,
  ParticipantRepository,
  BannerRepository,
} from "@/infra/mongodb";
// import { UserRepository, AuthRepository } from "@/infra/sqlite/repositories";

// Services
import {
  UserService,
  AuthService,
  ProfileService,
  MentorService,
  BookService,
  BannerService,
} from "@/services";

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
container.bind<MentorController>(MentorController).toSelf();
container.bind<BookController>(BookController).toSelf();
container.bind<BannerController>(BannerController).toSelf();

// REST Middleware Binding
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

// Socket Listener Binding

// Infrastructure Binding
// container.bind<SQLiteDataSource>(SQLiteDataSource).toSelf().inSingletonScope();
container.bind<MongoDBConnection>(MongoDBConnection).toSelf().inSingletonScope();

// Repository Binding Sqlite
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);
container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container.bind<IParticipantRepository>(TYPES.ParticipantRepository).to(ParticipantRepository);
container.bind<IBannerRepository>(TYPES.BannerRepository).to(BannerRepository);

// Service Bind
container.bind<AuthService>(AuthService).toSelf().inRequestScope();
container.bind<UserService>(UserService).toSelf();
container.bind<ProfileService>(ProfileService).toSelf();
container.bind<MentorService>(MentorService).toSelf();
container.bind<BookService>(BookService).toSelf();
container.bind<BannerService>(BannerService).toSelf();

export { container };
