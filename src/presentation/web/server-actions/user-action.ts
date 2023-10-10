"use server";
import { IBaseGetParam } from "@/common/libs/pagination";
import type { IUser, IUserCreate } from "@/domain/model";
import { container } from "@/ioc/container";
import { UserService } from "@/services/user-service";

import { revalidatePath } from "next/cache";

const _userService = container.resolve<UserService>(UserService);

export async function findAllUser(param: IBaseGetParam) {
  return await _userService.findAll(param);
}

export async function saveUser(param: IUserCreate) {
  revalidatePath("/user");
  return await _userService.save(param);
}

export async function findByIdUser(id: string) {
  revalidatePath("/user");
  return await _userService.findById(id);
}

export async function destroyUser(id: string): Promise<IUser> {
  revalidatePath("/user");
  return await _userService.destroy(id);
}
