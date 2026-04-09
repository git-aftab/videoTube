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
  console.log("Video uploaded!", video?.url);

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
  const { title, description } = req.body;
  let updateField = {};

  if (title) updateField.title = title;
  if (description) updateField.description = description;
  const { videoId } = req.params;

  const thumbnailLocatPath = req.file?.path;

  if (thumbnailLocatPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocatPath);
    if (!thumbnail) {
      throw new ApiError(500, "Thumbnail upload failed");
    }
    updateField.thumbnail = thumbnail?.url;
  }

  // empty check
  if (Object.keys(updateField).length === 0) {
    throw new ApiError(400, "No fields to update");
  }
  const videoDoc = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateField,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videoDoc, "Video Updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const {videoId} = req.params;
  
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});
