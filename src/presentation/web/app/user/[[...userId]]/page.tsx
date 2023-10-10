import "reflect-metadata";
import React from "react";
import { IUserCreate, User } from "@/domain/model";
import { findAllUser, findByIdUser } from "@/presentation/web/server-actions";
import UserView from "@/presentation/web/views/user/user";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: Record<string, string>;
  params: Record<string, unknown> | undefined;
}) {
  const users = await findAllUser({
    search: searchParams?.search || "",
    page: Number(searchParams?.page || 1),
    limit: Number(searchParams?.limit || 10),
  });
  let user: IUserCreate = User.create({
    fullname: "",
    username: "",
  }).unmarshall();
  if (params?.["userId"]) {
    const [userId] = params?.["userId"] as string[];
    if (userId) user = await findByIdUser(userId);
  }
  return <UserView users={users} user={user} />;
}
