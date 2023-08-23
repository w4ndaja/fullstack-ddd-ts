import Link from "next/link";
import { container } from "../../../../container";
import { UserService } from "../../../../app";
import { IUser } from "../../../../domain/model";

export default async function Page() {
  const getUser = async (): Promise<IUser> => {
    const userService = container.resolve<UserService>(UserService);
    const user = userService.findById("123");
    return user;
  };
  const user = await getUser();
  return (
    <>
      <h1>Welcome to About</h1>
      <Link href={`/`}>Home</Link>
      {JSON.stringify(user)}
    </>
  );
}
