import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(404, "Video title is required.");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(404, "Video localpath is required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  if (!video) {
    throw new ApiError(500, "failed to upload the video");
  }

  const thumbnailLocatPath = req.files?.thumbnail?.[0]?.path;
  const thumbnail = thumbnailLocatPath
    ? await uploadOnCloudinary(thumbnailLocatPath)
    : null;

  const videoDoc = await Video.create({
    title,
    videoFile: video?.url,
    description: description || "",
    duration: video?.duration,
    thumbnail: thumbnail?.url,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, videoDoc, "Video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
});

const updateVideoDets = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});
