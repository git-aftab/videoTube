import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyOwnerShip = (Model, paramName = "id", field = "owner") =>
  asyncHandler(async (req, res, next) => {
    const docId = req.params[paramName]; //paramName is the reqId => eg: video/:videoId not the monogo "_id"

    const doc = await Model.findById(docId);

    if (!doc) {
      throw new ApiError(404, "Resource not found!");
    }

    if (doc[field].toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Forbidden");
    }

    req.doc = doc;

    next();
  });
