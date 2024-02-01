import { container } from "@/ioc/container";
import { LiveTrainingService } from "@/services";

const liveTrainingService = container.get<LiveTrainingService>(LiveTrainingService);
liveTrainingService.finish("78228f17-f196-4598-adb7-402a3d7f2ee7")