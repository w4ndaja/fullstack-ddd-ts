import { IRestDto } from "../rest-dto";

export class RestMapper {
  public static dtoToRest(data: object, message?: string): IRestDto {
    return {
      statusCode: 200,
      message: message || "success",
      data,
    };
  }
}
