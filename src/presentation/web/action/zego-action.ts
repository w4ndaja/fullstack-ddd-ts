"use server";
import { config } from "@/common/utils";
import { container } from "@/ioc/container";
import { ZegoService } from "@/services";
const zegoService = container.get<ZegoService>(ZegoService);
export async function generateToken04(userId: string, effectiveTimeInSeconds: number) {
  return zegoService.generateToken04(userId, effectiveTimeInSeconds);
}

export async function getAppId() {
  return config.zego.appId;
}
