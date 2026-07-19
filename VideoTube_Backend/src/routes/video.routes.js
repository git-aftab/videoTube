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
  getVideosByUserId,
  asktoVideoAI,
} from "../controllers/video.controller.js";
import { optionalJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { cacheMiddleWare } from "../middlewares/cache.middleware.js";
import { uploadLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router
  .route("/")
  .get(
    cacheMiddleWare((req) => {
      const {
        page = 1,
        limit = 10,
        query,
        sortBy,
        sortType,
        userId,
      } = req.query;
      return `videos:${JSON.stringify({
        page,
        limit,
        query,
        sortBy,
        sortType,
        userId,
      })}`;
    }, 60),
    getAllVideos,
  )
  .post(
    uploadLimiter,
    verifyJWT,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo,
  );

router
  .route("/:videoId")
  .get(
    optionalJWT,
    cacheMiddleWare(
      (req) =>
        `video:${req.params.videoId}:user:${req.user?._id?.toString() || "guest"}`,
    ),
    getVideoById,
  )
  .patch(verifyJWT, verifyOwnerShip(Video, "videoId"), updateVideoDets)
  .delete(verifyJWT, verifyOwnerShip(Video, "videoId"), deleteVideo);

router
  .route("/:videoId/toggle-publish")
  .patch(verifyJWT, verifyOwnerShip(Video, "videoId"), togglePublishStatus);

router.route("/:videoId/ai").post(verifyJWT, asktoVideoAI);

router.route("/user/:userId").get(
  cacheMiddleWare((req) => `videos:${req.params.userId}`),
  verifyJWT,
  getVideosByUserId,
);

export default router;
