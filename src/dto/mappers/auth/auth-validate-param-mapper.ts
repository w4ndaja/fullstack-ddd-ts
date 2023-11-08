import { validateObject } from "@/common/libs/validation";
import { IAuthValidateParamDto } from "@/dto/auth/auth-validate-dto";
import { z } from "zod";

export class AuthValidateParamMapper {
  public static fromRest({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): IAuthValidateParamDto {
    const validated = validateObject(
      {
        email: z.string().email(),
        password: z.string(),
      },
      { email, password }
    );
    return validated;
  }
}
