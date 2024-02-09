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
  imap: {
    host: process.env.IMAP_HOST || "whm-admin.rexhoster.id",
    port: Number(process.env.IMAP_PORT || "993"),
    tls: process.env.IMAP_TLS == "true" || true,
  },
  webmailBe: {
    baseUrl : process.env.WEBMAIL_BE_BASE_URL || "http://localhost:8000/api"
  }
};
