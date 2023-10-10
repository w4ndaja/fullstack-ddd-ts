import { validateObject } from "@/common/libs/validation";
import { IAuthValidateParamDto } from "@/dto/auth/auth-validate-dto";
import { z } from "zod";

export class AuthValidateParamMapper {
  public static fromRest({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): IAuthValidateParamDto {
    const validated = validateObject(
      {
        username: z.string(),
        password: z.string(),
      },
      { username, password }
    );
    return validated;
  }
}
