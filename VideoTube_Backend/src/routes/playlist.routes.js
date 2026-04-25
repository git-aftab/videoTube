import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOwnerShip } from "../middlewares/ownership.middleware.js";
import { Playlist } from "../models/playlist.models.js";

import {
  createPlaylist,
  updatePlaylist,
  getPlaylistById,
  getUserPlaylists,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);

router
  .route("/:playlistId")
  .get(verifyJWT, getPlaylistById)
  .patch(verifyJWT, verifyOwnerShip(Playlist, "playlistId"), updatePlaylist)
  .delete(verifyJWT, verifyOwnerShip(Playlist, "playlistId"), deletePlaylist);

router
  .route("/:playlistId/:videoId")
  .post(verifyJWT, addVideoToPlaylist)
  .delete(
    verifyJWT,
    verifyOwnerShip(Playlist, "playlistId"),
    removeVideoFromPlaylist,
  );

router.route("/user/:userId").get(verifyJWT, getUserPlaylists);

export default router;
