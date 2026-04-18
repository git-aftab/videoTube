import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // STEP_01: MATCH
  const matchStage = { isPublished: true }; //show only published Video

  // if user provided filter by that
  if (userId) {
    if (!isValidObjectId(userId)) throw new ApiError(404, "Invalid userId");
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  // if query provied search in title && description
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } }, //"i" = Case in-sensitive
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // STEP_02: SORT
  const pipeline = [
    //stage 1: filter docs
    { $match: matchStage },

    //stage 2: sort dods
    {
      $sort: {
        [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1,
      },
    },

    // stage 3: join with users collection to get owner details
    {
      $lookup: {
        from: "users", //collection to join with
        localField: "owner", //field in video doc
        foreignField: "_id", //field in user doc
        as: "ownerDetails", //Output array field name
        pipeline: [
          //nested: only pick needed field in user
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },

    // stage 4: $lookup always retrun array, flatten to single object
    {
      $addFields: {
        ownerDetails: { $first: "$ownerDetails" },
      },
    },

    // stage 5: Pick only the fields you want in res.
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        ownerDetails: 1,
      },
    },
  ];

  // stept 3: paginate using plugin in model
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  console.log("req.files:", req.files);
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(404, "Video title is required.");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  console.info("Video Local Path:", videoLocalPath);

  if (!videoLocalPath) {
    throw new ApiError(404, "Video localpath is required");
  }

  const video = await uploadVideoToCloudinary(videoLocalPath);
  if (!video) {
    throw new ApiError(500, "failed to upload the video");
  }
  console.log("Video uploaded!", video?.url);

  const thumbnailLocatPath = req.files?.thumbnail?.[0]?.path;
  const thumbnail = thumbnailLocatPath
    ? await uploadImageToCloudinary(thumbnailLocatPath)
    : null;

  const videoDoc = await Video.create({
    title,
    videoFile: video?.url,
    description: description || "",
    duration: video?.duration,
    thumbnail: thumbnail?.url || "",
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, videoDoc, "Video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid videoId");
  }

  // Aggregate pipeline to fetch video -> owner details
  const video = await Video.aggregate([
    // Stage 1: find this specific video
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },

    // Stage 2: Join with users to get Owner Details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },

    // Stage 3: Flatten OwnerDetails array to object
    {
      $addFields: {
        ownerDetails: { $first: "$ownerDetails" },
      },
    },
  ]);

  // aggregate always returns an array -> get the first elem
  if (!video.length) {
    throw new ApiError(404, "Video not found");
  }

  // increment view count every time the video is fetched
  await Video.findByIdAndUpdate(videoId, {
    $inc: { views: 1 }, // $inc increments the field by given val
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video Fetched Successfully"));
});

const updateVideoDets = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;
  let updateField = {};

  if (title) updateField.title = title;
  if (description) updateField.description = description;

  const thumbnailLocatPath = req.file?.path;

  if (thumbnailLocatPath) {
    const thumbnail = await uploadImageToCloudinary(thumbnailLocatPath);
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
  const { videoId } = req.params;

  // Getting the video and verifying ownerShip in the router using the verifyOwnerShip middleware

  const video = req.doc;
  console.log("Data in req.doc", req.doc);

  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, "Error deleting video. Please Try Again");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedVideo: deletedVideo },
        "Video deleted Successfully",
      ),
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = req.doc;
  console.log("Data in req.doc", req.doc);

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: { isPublished: !video.isPublished } },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: updatedVideo.isPublished, updatedVideo: updatedVideo },
        `Video is now ${updatedVideo.isPublished ? "Published" : "Unpublished"}`,
      ),
    );
});

export {
  publishAVideo,
  togglePublishStatus,
  updateVideoDets,
  deleteVideo,
  getAllVideos,
  getVideoById,
};
