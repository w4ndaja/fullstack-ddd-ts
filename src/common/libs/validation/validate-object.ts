import { ZodRawShape, z } from "zod";
import { AppError } from "../error-handler";
import { ErrorCode } from "@/common/utils";

export const validateObject = <T extends ZodRawShape>(validation:T, source:unknown) => {
  const safeParse = z.object(validation).safeParse(source);
  if (!safeParse.success) {
    throw new AppError(
      ErrorCode.UNPROCESSABLE_ENTITY,
      "Validation Failed",
      safeParse.error.flatten()
    );
  }
  return safeParse.data;
};
