"use server";
import { config } from "@/common/utils";
import { container } from "@/ioc/container";
export async function generateToken04(userId: string, effectiveTimeInSeconds: number) {
}

export async function getAppId() {
  return config.zego.appId;
}
