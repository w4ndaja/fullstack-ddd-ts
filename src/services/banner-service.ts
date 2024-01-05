import { Logger } from "@/common/libs/logger";
import {
  GenericPaginatedData,
  IBaseGetParam,
  IGenericPaginatedData,
} from "@/common/libs/pagination";
import { Banner, IBanner, IBannerCreate } from "@/domain/model/banner";
import { IBannerRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class BannerService {
  @inject(TYPES.Logger) private declare _logger: Logger;
  @inject(TYPES.BannerRepository) private declare _bannerRepository: IBannerRepository;
  public async findAll(param: IBaseGetParam): Promise<IGenericPaginatedData<IBanner>> {
    const bannerDto = await this._bannerRepository.findAll(param);
    const banners = GenericPaginatedData.create({
      ...bannerDto,
      data: bannerDto.data.map((item) => Banner.create(item).unmarshall()),
    }).unmarshall();
    return banners;
  }

  public async findById(id: IBanner["id"]): Promise<IBanner> {
    const banner = await this._bannerRepository.findById(id);
    return banner;
  }

  public async save(param: IBannerCreate): Promise<IBanner> {
    const bannerEntity = Banner.create(param);
    const _bannerEntity = bannerEntity.unmarshall();
    const bannerPersist = await this._bannerRepository.save(_bannerEntity);
    return bannerPersist;
  }

  public async destroy(id: IBanner["id"]): Promise<IBanner> {
    const banner = Banner.create(await this._bannerRepository.findById(id));
    banner.delete();
    const _banner = banner.unmarshall();
    await this._bannerRepository.save(_banner);
    return _banner;
  }
}
