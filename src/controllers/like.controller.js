import { Like } from "../models/like.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

// Controllers
const toggleVideoLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on videos
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on tweets
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on comment
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // TODO: get all liked videos of user
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
