import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

const validate = (req, res, next) => {
  console.log(req["express-validator#contexts"]);

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedError = [];

  errors.array().map((err) => extractedError.push({ [err.path]: err.msg }));

  throw new ApiError(422, "Recieved Data is not valid", extractedError);
};

export { validate };
