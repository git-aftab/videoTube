import { Video } from "../models/video.models.js";
import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";
import { Router } from "express";
import {
  publishAVideo,
  updateVideoDets,
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllVideos).post(verifyJWT, publishAVideo);

router
  .route("/:videoId")
  .get(verifyJWT, getVideoById)
  .patch(verifyJWT, verifyOwnerShip(Video, "videoId"), updateVideoDets)
  .delete(verifyJWT, verifyOwnerShip(Video, "videoId"), deleteVideo);

router
  .route("/:videoId/toggle-publish")
  .patch(verifyJWT, verifyOwnerShip(Video, "videoId"), togglePublishStatus);

export default router;
