import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name.trim()) {
    throw new ApiError(400, "Playlist Name is required");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description || "",
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist Created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  const { userId } = req.params;
  console.log("got user id", userId);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  console.log("yes valid objectId(userId");

  const playlists = await Playlist.find({ owner: userId })
    .select("name description videos createdAt")
    .sort({ createdAt: -1 });

  console.log(`playlists of the ${userId}: ${playlists}`);

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully"),
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  const playlist = await Playlist.findById(playlistId).populate({
    path: "videos",
    select: "title thumbnail duration views",
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Fetched Successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid palylist or Video Id");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videoId } },
    { new: true },
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully"),
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid palylist or Video Id");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: {videoId} },
    { new: true },
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (deletePlaylist) {
    throw new ApiError(404, "Error Deleting the Playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletePlaylist, "Playlist deleted successfully"),
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const playlist = req.doc;

  let updateField = {};

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  if (name !== undefined && name !== playlist.name) {
    updateField.name = name;
  }
  if (description !== undefined && description !== playlist.description) {
    updateField.description = description;
  }

  if (Object.keys(updateField).length === 0) {
    throw new ApiError(400, "No changes provided");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: updateField },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully"),
    );
});

// ------------ EXAMPLE: just using req.doc -------------

// const updatePlaylist = asyncHandler(async (req, res) => {
//   const { name, description } = req.body;
//   const playlist = req.doc;

//   const updateField = {};

//   if (name?.trim() && name !== playlist.name) {
//     updateField.name = name;
//   }

//   if (description !== undefined && description !== playlist.description) {
//     updateField.description = description;
//   }

//   if (Object.keys(updateField).length === 0) {
//     throw new ApiError(400, "No changes provided");
//   }

//   Object.assign(playlist, updateField);
//   await playlist.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
// });

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
