import { injectable } from "inversify";
import { AuthController } from "./controllers/auth-controller";
import { Router } from "./libs/router";
import { UserController } from "./controllers/user-controller";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { MentorController } from "./controllers/mentor-controller";
import { BookController } from "./controllers/book-controller";
import { BannerController } from "./controllers/banner-controller";
import { FileStorageController } from "./controllers/file-storage-controller";
import { LiveTrainingController } from "./controllers/live-training-controller";
import { ChatSessionController } from "./controllers/chat-session-controller";
import { StorageController } from "./controllers/storage-controller";
import { TransactionController } from "./controllers/transaction-controller";
import { WalletController } from "./controllers/wallet-controller";
import { WithdrawController } from "./controllers/withdraw-controller";

@injectable()
export class Routes extends Router {
  constructor(
    private authController: AuthController,
    private userController: UserController,
    private mentorController: MentorController,
    private bookController: BookController,
    private bannerController: BannerController,
    private fileController: FileStorageController,
    private liveTrainingController: LiveTrainingController,
    private chatSesssionController: ChatSessionController,
    private storageController: StorageController,
    private transactionController: TransactionController,
    private walletController:WalletController,
    private withdrawController:WithdrawController
  ) {
    super();
    this.getRouter().get("/health-check", async (req, res) => res.send("SERVER IS UP"));
    this.getRouter().use(this.authController.getRouter());
    this.getRouter().use(this.userController.getRouter());
    this.getRouter().use(this.mentorController.getRouter());
    this.getRouter().use(this.bookController.getRouter());
    this.getRouter().use(this.bannerController.getRouter());
    this.getRouter().use(this.fileController.getRouter());
    this.getRouter().use(this.liveTrainingController.getRouter());
    this.getRouter().use(this.chatSesssionController.getRouter());
    this.getRouter().use(this.storageController.getRouter());
    this.getRouter().use(this.transactionController.getRouter());
    this.getRouter().use(this.walletController.getRouter());
    this.getRouter().use(this.withdrawController.getRouter());
    this.getRouter().all("*", async (req, res, next) => {
      next(new AppError(ErrorCode.NOT_FOUND, "Not found"));
    });
  }
}
