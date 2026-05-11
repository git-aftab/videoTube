import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";
import { Tweet } from "../models/tweet.models.js";
import {
  getUserTweets,
  createTweet,
  updateTweet,
  deleteTweet,
  getAllTweets,
} from "../controllers/tweet.controller.js";
import { uploadLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.route("/").get(uploadLimiter,verifyJWT, getAllTweets).post(verifyJWT, createTweet);

router
  .route("/:tweetId")
  .delete(verifyJWT, verifyOwnerShip(Tweet, "tweetId"), deleteTweet)
  .patch(verifyJWT, verifyOwnerShip(Tweet, "tweetId"), updateTweet);

router.route("/:userId").get(verifyJWT, getUserTweets);

export default router;
