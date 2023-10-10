import type { IAuth } from "@/domain/model/auth";
import type { IUserRepository, IAuthRepository } from "@/domain/service";

import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";
import { Auth } from "@/domain/model/auth";
import { TYPES } from "@/ioc/types";

import { inject, injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@/domain/model";
import { Logger } from "@/common/libs/logger";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
    @inject(TYPES.Logger) private logger: Logger
  ) {}
  /**
   * validate client authority
   * @param username username of client
   * @param password password of client
   * @returns plain Object of Auth
   */
  public async validate(username: string, password: string): Promise<IAuth> {
    // Get User by username and match their password unless throw an unauthorized error
    const userDto = await this.userRepository.findByUsername(username).catch((res) => null);
    if (!userDto) throw new AppError(ErrorCode.UNAUTHORIZED, "Username not Found");
    const user = User.create(userDto);
    if (!user || !user.checkPassword(password)) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }
    // Create and save auth object to persistence
    const auth = Auth.create({
      userId: user.id,
      expired: false,
      user: userDto,
    });
    auth.token = await this.generateToken(auth.id);
    const _auth = auth.unmarshall();

    await this.authRepository.save(_auth);
    return _auth;
  }
  /**
   * Validates a given token and returns the authenticated user.
   * @param token - The token to be validated.
   * @returns The authenticated user.
   * @throws AppError with ErrorCode.UNAUTHORIZED if the token is invalid or not found.
   */
  public async validateToken(token: string): Promise<IAuth> {
    const authId = await this.verifyToken(token);
    const authDto = await this.authRepository.findAliveAuth(authId, token);
    if (!authDto) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", "Token Invalid");
    }
    const newAuth = Auth.create(authDto);
    const newAuthDto = newAuth.unmarshall();
    return newAuthDto;
  }
  /**
   * Invalidates the given token by destroying the corresponding authentication record.
   * @param token - The token to invalidate.
   * @returns A Promise that resolves when the token is invalidated.
   */
  public async invalidate(token: string): Promise<void> {
    const authId = this.verifyToken(token);
    await Promise.all([
      await this.authRepository.findAliveAuth(authId, token),
      await this.authRepository.destroy(authId),
    ]);
  }
  /**
   * Generates a JWT token for the given user ID.
   * @param id - The user ID to generate the token for.
   * @returns A Promise that resolves to the generated JWT token.
   */
  private async generateToken(id: string): Promise<string> {
    return await (<string>jwt.sign(id, this.authRepository.privateKey, { algorithm: "RS256" }));
  }
  /**
   * Verifies the given JWT token using the public key from the authentication repository.
   * @param token - The JWT token to verify.
   * @returns The string representation of the verified token.
   */
  private verifyToken(token: string): string {
    return String(jwt.verify(token, this.authRepository.publicKey));
  }
}
