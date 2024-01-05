import { IBanner } from "@/domain/model/banner";
import { IBannerRepository } from "@/domain/service/banner-repository";
import { Repository } from "./repository";
import { injectable } from "inversify";
@injectable()
export class BannerRepository extends Repository<IBanner> implements IBannerRepository {
  constructor() {
    super("banners");
  }
}
