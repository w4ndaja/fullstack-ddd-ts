export type IAuthLoginDto = String;
export type IAuthValidateDto = {
  token: string;
  user: {
    fullname: string;
    username: string;
  };
};
