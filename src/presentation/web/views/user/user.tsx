"use client";

import React, { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { destroyUser, saveUser } from "../../server-actions";
// import { IUser, IUserCreate } from "@/domain/model";
// import { IGenericPaginatedData } from "@/common/libs/pagination";

export default function UserView(
  // { users, user }: { users: IGenericPaginatedData<IUser>; user: IUserCreate }
  ) {
  // const [form, setForm] = useState<IUserCreate>(user);
  // const useRoute = useRouter();
  // const handleFormChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  // };
  // const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  //   e.preventDefault();
  //   await saveUser(form);
  //   if (form.id) {
  //     setForm({ id: undefined, fullname: "", username: "", password: "", createdAt: undefined });
  //     useRoute.replace("/user");
  //   } else {
  //     setForm({ id: undefined, fullname: "", username: "", password: "", createdAt: undefined });
  //   }
  // };
  // const onDestroy = async (e: MouseEvent<HTMLButtonElement>, id: IUser["id"]) => {
  //   e.preventDefault();
  //   await destroyUser(id);
  // };
  return (
    <div className="p-4 bg-cyan-950 text-gray-200 h-full">
      <div className="text-red-600">Hello, Next.js!</div>
      <Link href={`/about`}>Halo</Link>
      <form
      // onSubmit={handleFormSubmit}
      className="max-w-xl text-gray-700 bg-gray-300 p-4 rounded-lg mb-4 mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullname">Fullname</label>
          <input
            id="fullname"
            name="fullname"
            // onChange={handleFormChange}
            // value={form.fullname}
            type="text"
            className="px-4 py-2 rounded bg-gray-50 mb-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="username"
            // onChange={handleFormChange}
            // value={form.username}
            type="text"
            className="px-4 py-2 rounded bg-gray-50 mb-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            // onChange={handleFormChange}
            // type="password"
            name="password"
            className="px-4 py-2 rounded bg-gray-50 mb-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-green-500">
            Submit
          </button>
        </div>
      </form>
      <table id="userTable" className="border-spacing-0 border-t border-l max-w-xl">
        <thead>
          <tr className="text-gray-900">
            <th className="border-r border-b px-4 py-2 text-left bg-gray-100">Fullname</th>
            <th className="border-r border-b px-4 py-2 text-left bg-gray-100">Email</th>
            <th className="border-r border-b px-4 py-2 text-left bg-gray-100">Created At</th>
            <th className="border-r border-b px-4 py-2 text-left bg-gray-100">Updated At</th>
            <th className="border-r border-b px-4 py-2 text-left bg-gray-100">#</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.data.map((item) => ( */}
            <tr
            // key={item.id}
            >
              <td className="border-r border-b px-4 py-2 whitespace-nowrap">
                {/* {item.fullname} */}
                </td>
              <td className="border-r border-b px-4 py-2 whitespace-nowrap">
                {/* {item.username} */}
                </td>
              <td className="border-r border-b px-4 py-2 whitespace-nowrap">
                {/* {item.createdAt && new Date(item.createdAt).toLocaleString("id")} */}
              </td>
              <td className="border-r border-b px-4 py-2 whitespace-nowrap">
                {/* {item.updatedAt && new Date(item.updatedAt).toLocaleString("id")} */}
              </td>
              <td className="border-r border-b px-4 py-2 whitespace-nowrap">
                <div className="flex gap-2">
                  {/* <Link href={`/user/${item.id}`}>Edit</Link>
                  <button onClick={(e) => onDestroy(e, item.id)} type="button" role="button">
                    Hapus
                  </button> */}
                </div>
              </td>
            </tr>
          {/* ))} */}
        </tbody>
      </table>
      Showing from
      {/* {users.from}  */}
      to
      {/* {users.to}  */}
      of
      <div className="flex mt-2">
        {/* {users.links.map((item, i) => ( */}
          {/* <Link
            className={`px-2 py-1 border ${item.active ? "bg-red-700 text-gray-200" : "bg-gray-50 text-gray-700"} ${
              item.disabled && "cursor-default bg-gray-200"
            }`}
            href={`?page=${item.page}#userTable`}
            key={i}
          >
            {item.label}
          </Link> */}
        {/* ))} */}
      </div>
    </div>
  );
}
