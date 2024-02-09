import { IAuth } from "@/domain/model/auth";
import { IAuthLoginDto, IAuthValidateDto } from "../auth-dto";

export class AuthMapper {
  public static domainToLoginDto(auth: IAuth): IAuthLoginDto {
    return auth.token || "";
  }
  public static domainToValidateDto(auth: IAuth): IAuthValidateDto {
    return {
      token: auth.token || "",
      user: {
        fullname: auth.user.fullname || "",
        username: auth.user.username || "",
      },
    };
  }
}
