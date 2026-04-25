import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";
import {
  addCommentValidator,
  updateCommentValidator,
} from "../validators/comment.validators.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { Comment } from "../models/comment.models.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router
  .route("/:videoId")
  .get(getVideoComments)
  .post(verifyJWT, ...addCommentValidator(), validate, addComment);

router
  .route("/:videoId/:commentId")
  .post(verifyJWT, verifyOwnerShip(Comment, "commentId"), deleteComment)
  .patch(
    verifyJWT,
    verifyOwnerShip(Comment, "commentId"),
    ...updateCommentValidator(),
    validate,
    updateComment,
  );

export default router;
