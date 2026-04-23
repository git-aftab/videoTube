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

const router = Router();

router.route("/:videoId").get(getVideoComments).post(verifyJWT, addComment);

router
  .route("/:videoId/:commentId")
  .post(verifyJWT, verifyOwnerShip(Comment, "commentId"), deleteComment)
  .patch(verifyJWT, verifyOwnerShip(Comment, "commentId"), updateComment);

export default router;
