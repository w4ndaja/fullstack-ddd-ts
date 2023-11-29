import { Logger } from "@/common/libs/logger";
import { ClientRepository } from "@/infra/mongodb";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { AuthService } from "./auth-service";
import { Client, IClient } from "@/domain/model";
import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";

@injectable()
export class ClientService {
  @inject(TYPES.ClientRepository) private declare _clientRepository: ClientRepository;
  @inject(TYPES.Logger) private declare _logger: Logger;
  @inject(AuthService) private declare _authService: AuthService;
  async getProfile(): Promise<IClient> {
    if (!this._authService.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const client = Client.create(
      await this._clientRepository.findByUserId(this._authService.auth.userId)
    );
    return client.unmarshall();
  }
  async saveProfile(profile: Partial<IClient>): Promise<IClient> {
    if (!this._authService.auth) throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    const client = Client.create(
      await this._clientRepository.findByUserId(this._authService.auth.userId)
    );
    return client.unmarshall();
  }
  async save(_client: IClient): Promise<IClient> {
    const client = Client.create(_client);
    const clientDto = client.unmarshall();
    const savedClient = await this._clientRepository.save(clientDto);
    return savedClient;
  }
}
