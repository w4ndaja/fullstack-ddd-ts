"use server";

import { config } from "@/common/utils";

export async function getConfig() {
  return config;
}
