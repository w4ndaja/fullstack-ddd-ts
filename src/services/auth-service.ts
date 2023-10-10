import type { IAuth } from "@/domain/model/auth";
import type { IUserRepository, IAuthRepository } from "@/domain/service";

import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";
import { Auth } from "@/domain/model/auth";
import { TYPES } from "@/ioc/types";

import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { User } from "@/domain/model";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) { }

  /**
   * validate client authority
   * @param username username of client
   * @param password password of client
   * @returns plain Object of Auth
   */
  public async validate(username: string, password: string): Promise<IAuth> {
    // Get User by username and match their password unless throw an unauthorized error
    const _user = await this.userRepository.findByUsername(username).catch((res) => null);
    if (!_user) throw new AppError(ErrorCode.UNAUTHORIZED, "Username not Found");
    const user = User.create(_user);
    if (!user || !user.checkPassword(password)) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    // Create and save auth object to persistence
    const auth = Auth.create({
      userId: user.id,
      expired: false,
      user: _user,
    });
    auth.token = await this.generateToken(auth.id);
    const _auth = auth.unmarshall();

    await this.authRepository.save(_auth);
    return _auth;
  }

  public async validateToken(token: string): Promise<IAuth> {
    const authId = await this.verifyToken(token);
    const auth = await this.authRepository.findAliveAuth(authId, token);
    if (!auth) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", "Token Not Found");
    }
    const newAuth = Auth.create({
      ...auth,
      token: await this.generateToken(auth.id),
      id: undefined,
    });
    this.authRepository.destroy(auth.id);
    const _newAuth = newAuth.unmarshall();
    this.authRepository.save(_newAuth);
    return _newAuth;
  }

  public async invalidate(token: string): Promise<void> {
    const authId = await this.verifyToken(token);
    await Promise.all([
      await this.authRepository.findAliveAuth(authId, token),
      await this.authRepository.destroy(authId),
    ]);
  }

  private async generateToken(id: string): Promise<string> {
    return await (<string>jwt.sign(id, this.authRepository.privateKey, { algorithm: "RS256" }));
  }

  private async verifyToken(token: string): Promise<string> {
    return await (<string>jwt.verify(token, this.authRepository.publicKey));
  }
}
