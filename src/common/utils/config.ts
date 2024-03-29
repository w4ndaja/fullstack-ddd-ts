import dotEnv from "dotenv";
import path from "path";
import { getEnvFileName } from "@/common/libs/config/get-env-file-name";
let port: string | undefined = process.env.PORT;
dotEnv.config({
  override: true,
  path: path.join(process.cwd(), getEnvFileName()),
});

export const defaultStorageDir = path.join(process.cwd(), "storage");
export const config = {
  app: {
    env: process.env.NODE_ENV || "production",
    name: process.env.APP_NAME || "Fullstack WEB TS APP",
    host: process.env.HOST || "0.0.0.0",
    port: Number(port || process.env.PORT) || 3000,
    privateKey: process.env.PRIVATE_KEY || path.join(process.cwd(), "private-key.pem"),
    publicKey: process.env.PUBLIC_KEY || path.join(process.cwd(), "public-key.pem"),
    appUrlPrefix: process.env.APP_URL_PREFIX || "/",
    apiUrlPrefix: process.env.REST_URL_PREFIX || "/api/",
  },
  connection: {
    mongodb: {
      uri: process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/",
      dbName: process.env.MONGO_DB_NAME || "mongoDbName",
    },
    firebaseAdmin: {
      serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH,
    },
    ahmIt: {
      baseUrl: process.env.AHM_REST_BASE_URL,
    },
    sqlite: {
      database:
        process.env.SQLITE_PATH ||
        "C:/Users/User/code/mine/fullstack-ts-scaffold/storage/db/sqlite.db",
    },
  },
  storageDir: process.env.STORAGE_DIR || defaultStorageDir,
  presentation: {
    dir: path.join(
      process.cwd(),
      process.env.NODE_ENV === "production" ? "dist/presentation/web" : "src/presentation/web"
    ),
  },
  zego: {
    appId: process.env.ZEGO_APP_ID || "",
    secret: process.env.ZEGO_SECRET || "",
  },
  camy: {
    email: {
      username: process.env.CAMY_EMAIL_USERNAME || "developer@rexhoster.id",
      password: process.env.CAMY_EMAIL_PASSWORD || "123123123",
      host: process.env.CAMY_EMAIL_HOST || "mail.rexhoster.id",
    },
    liveRoomUrl: process.env.LIVE_ROOM_URL || "https://camy-dev.pentarex.id",
  },
  midtrans: {
    env: process.env.MIDTRANS_ENV || "SANDBOX",
    chargeUrlSandbox:
      process.env.MIDTRANS_CHARGE_URL_SANDBOX ||
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
    clientKeySandbox: process.env.MIDTRANS_CLIENT_KEY_SANDBOX || "SB-Mid-client-AmHndSJPH05XStfJ",
    serverKeySandbox:
      process.env.MIDTRANS_SERVER_KEY_SANDBOX || "SB-Mid-server-1eY5p54sKVB6kWQSl87xCtAf",
    chargeUrlProduction:
      process.env.MIDTRANS_CHARGE_URL_PRODUCTION || "https://app.midtrans.com/snap/v1/transactions",
    clientKeyProduction:
      process.env.MIDTRANS_CLIENT_KEY_PRODUCTION || "Mid-client-JzJIiu1Ymz7X4EAz",
    serverKeyProduction:
      process.env.MIDTRANS_SERVER_KEY_PRODUCTION || "Mid-server-uAk-NeS8dZkJfA_ecaS45NGq",
    finishUrlSandbox: process.env.MIDTRANS_FINISH_URL_SANDBOX || "camyrtc://books",
    finishUrlProduction: process.env.MIDTRANS_FINISH_URL_PRODUCTION || "camyrtc://books",
  },
};
