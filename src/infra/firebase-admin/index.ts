import type { Logger } from '@/common/libs/logger/logger';
import { ErrorCode } from '@/common/utils/error-code';
import { AppError } from '@/common/libs/error-handler';
import { config } from '@/common/utils/config';
import { TYPES } from '@/ioc/types';
import { Firestore } from '@google-cloud/firestore';
import { App, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { inject, injectable } from 'inversify';
@injectable()
export class FirebaseAdmin {
  private app: App;
  public db: Firestore;
  constructor(@inject(TYPES.Logger) private logger: Logger) {
    if (!config.connection.firebaseAdmin.serviceAccountPath) {
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Internal Server Error", {
        message: "Service Account Path Not Set"
      });
    }
    this.app = initializeApp({
      credential: cert(config.connection.firebaseAdmin.serviceAccountPath)
    });
    this.db = getFirestore();
  }
}
