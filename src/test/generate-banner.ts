import { Banner } from "@/domain/model/banner";
import { container } from "@/ioc/container";
import { BannerService } from "@/services";

const bannerService = container.get<BannerService>(BannerService);
for (let i = 0; i < 3; i++) {
  const banner = Banner.create({
    order: i + 1,
    imageUrl: `https://camy-dev.pentarex.id/storage/banners/banner-1.png`,
  });
  bannerService.save(banner.unmarshall());
}
