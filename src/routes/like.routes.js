import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";

import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Comment } from "../models/comment.models.js";

const router = Router();

router
  .route("/:videoId")
  .post(verifyJWT, verifyOwnerShip(Video, "videoId"), toggleVideoLike);
router
  .route("/:tweetId")
  .post(verifyJWT, verifyOwnerShip(Tweet, "tweetId"), toggleTweetLike);
router
  .route("/:commentId")
  .post(verifyJWT, verifyOwnerShip(Comment, "commentId"), toggleCommentLike);

router.route("/get-liked-videos").get(verifyJWT, getLikedVideos);

export default router;
