import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";


const router = Router();
router
  .route("/:channelId")
  .get(verifyJWT, getUserChannelSubscribers)
  .post(verifyJWT, toggleSubscription);

router.route("/:userId").post(verifyJWT, getSubscribedChannels);

export default router