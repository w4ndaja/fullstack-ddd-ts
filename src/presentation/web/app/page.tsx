import React from "react";
import { IUser } from "../../../domain/model";
import { container } from "../../../container";
import { UserService } from "../../../app";
import Link from "next/link";
async function getUser(id: string): Promise<IUser> {
  "use server";
  const userService = container.resolve<UserService>(UserService);
  const user = userService.findById("123");
  return user;
}
export default async function Page() {
  const user = await getUser("asd");
  return (
    <>
      <h1>Hello, Next.js!</h1>
      <Link href={`about`}>Halo</Link>
      <table>
        <thead>
          {Object.keys(user).map((key, i) => (
            <tr key={i}>
              <td>{key}</td>
              <td>: {String(user[key as keyof IUser])}</td>
            </tr>
          ))}
        </thead>
      </table>
    </>
  );
}
