import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";

import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
// import { Like } from "../models/like.models.js";
// import { Video } from "../models/video.models.js";
// import { Tweet } from "../models/tweet.models.js";
// import { Comment } from "../models/comment.models.js";

const router = Router();

router.route("/video-like/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/tweet-like/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/comment-like/:commentId").post(verifyJWT, toggleCommentLike);

router.route("/get-liked-videos").get(verifyJWT, getLikedVideos);

export default router;
