import mongoose from "mongoose";
import { BadRequestError } from "./error.js";

export const validateObjectId = (
  id: string | any,
  fieldName: string = "id",
): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${fieldName}`);
  }
};
