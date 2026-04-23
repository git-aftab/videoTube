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

router.route("/").get(verifyJWT, createPlaylist);

router
  .route("/:playlistId")
  .get(verifyJWT, getPlaylistById)
  .post(verifyJWT, verifyOwnerShip(Playlist, "playlistId"), deletePlaylist)
  .post(verifyJWT, verifyOwnerShip(Playlist, "playlistId"), updatePlaylist);


router
  .route("/:playlistId/:videoId")
  .post(verifyJWT, verifyOwnerShip(Playlist, "playlistId"), addVideoToPlaylist)
  .post(
    verifyJWT,
    verifyOwnerShip(Playlist, "playlistId"),
    removeVideoFromPlaylist,
  );

router.route("/userId").get(verifyJWT, getUserPlaylists);

export default router;
