import type { IAuth } from "@/domain/model/auth";
import type { IUserRepository, IAuthRepository, IParticipantRepository } from "@/domain/service";

import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils/error-code";
import { Auth } from "@/domain/model/auth";
import { TYPES } from "@/ioc/types";

import { inject, injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, Participant, User } from "@/domain/model";
import { Logger } from "@/common/libs/logger";
import { EROLES } from "@/common/utils/roles";
import { FirebaseAdmin } from "@/infra/firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";
import axios from "axios";
import { GAuthDecoded, IGAuthDecoded } from "@/domain/model/google-auth-decoded";
@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository,
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
    @inject(TYPES.Logger) private logger: Logger,
    @inject(FirebaseAdmin) private firebase: FirebaseAdmin
  ) {}
  /**
   * validate client authority
   * @param username username of client
   * @param password password of client
   * @returns plain Object of Auth
   */
  public async login(username: string, password: string): Promise<IAuth> {
    // Get User by username and match their password unless throw an unauthorized error
    const userDto = await this.userRepository.findByUsernameOrEmail(username).catch((res) => null);
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
   * register
   */
  public async register(email: string, password: string): Promise<IAuth> {
    const userEntity = User.create({
      email: email,
      roles: [EROLES.PARTICIPANT],
    });
    userEntity.password = password;
    const existUser = await this.userRepository.findByUsernameOrEmail(email);
    if (existUser) throw new AppError(ErrorCode.UNPROCESSABLE_ENTITY, "User Already Exist");
    const userDto = userEntity.unmarshall();
    const participantEntity = Participant.create({
      userId: userDto.id,
      username: userDto.email,
      fullname: userDto.fullname,
      followerCount: 0,
      followingCount: 0,
      bio: "",
      gender: null,
      avatarUrl: "https://dummyimage.com/200x200",
      introVideo: {
        service: "youtube",
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      },
      hasUnreadNotif: false,
    });
    const participantDto = participantEntity.unmarshall();
    this.userRepository.save(userDto);
    this.participantRepository.save(participantDto);
    const auth = Auth.create({
      userId: userDto.id,
      expired: false,
      user: userDto,
    });
    auth.token = await this.generateToken(auth.id);
    const _auth = auth.unmarshall();
    this.authRepository.save(_auth);
    return _auth;
  }

  /**
   * Validates a given token and returns the authenticated user.
   * @param token - The token to be validated.
   * @returns The authenticated user.
   * @throws AppError with ErrorCode.UNAUTHORIZED if the token is invalid or not found.
   */
  public async checkToken(token: string): Promise<IAuth> {
    const authId = await this.verifyToken(token);
    const authDto = await this.authRepository.findAliveAuth(authId, token);
    if (!authDto) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", "Token Invalid");
    }
    const userDto = await this.userRepository.findById(authDto.userId);
    const newAuth = Auth.create({ ...authDto, user: userDto });
    const newAuthDto = newAuth.unmarshall();
    return newAuthDto;
  }
  /**
   * Invalidates the given token by destroying the corresponding authentication record.
   * @param token - The token to invalidate.
   * @returns A Promise that resolves when the token is invalidated.
   */
  public async logout(token: string): Promise<void> {
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

  async loginByGoogle(idToken: string): Promise<IAuth> {
    let userDto: IUser;
    let gAuthDto: IGAuthDecoded;
    try {
      const { data: keys } = await axios.get(
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
      );
      gAuthDto = <IGAuthDecoded>jwt.decode(idToken);
      const gAuth = GAuthDecoded.create(gAuthDto);
      if (gAuth.exp > Date.now()) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Session Expired!");
      }
      userDto = await this.userRepository.findByUsernameOrEmail(gAuth.email);
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ErrorCode.UNAUTHORIZED, "Token Invalid!");
    }
    let user = userDto
      ? User.create(userDto)
      : User.create({
          username: gAuthDto.email.split("@")[0],
          email: gAuthDto.email,
          avatarUrl: gAuthDto.picture,
        });
    user.setRole(EROLES.PARTICIPANT);
    user.username = gAuthDto.email.split("@")[0];
    user.avatarUrl = gAuthDto.picture;
    user.fullname = gAuthDto.name;
    user.email = gAuthDto.email;
    userDto = user.unmarshall();
    this.logger.info("Saving user with", userDto);
    let participantDto = await this.participantRepository.findByUserId(userDto.id);
    let participant = participantDto
      ? Participant.create(participantDto)
      : Participant.create({
          userId: user.id,
          username: user.email.split("@")[0],
          fullname: user.fullname,
          bio: "",
          gender: "",
        });
    const auth = Auth.create({
      userId: user.id,
      expired: false,
      user: userDto,
    });
    auth.token = await this.generateToken(auth.id);
    const authDto = auth.unmarshall();
    participantDto = participant.unmarshall();
    await Promise.all([
      this.userRepository.save(userDto),
      this.authRepository.save(authDto),
      this.participantRepository.save(participantDto),
    ]);
    return authDto;
  }
}
