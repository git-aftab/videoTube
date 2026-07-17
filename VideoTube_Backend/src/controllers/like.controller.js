import { Like } from "../models/like.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { deleteCache } from "../utils/cache.js";

// Controllers
const toggleVideoLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on videos
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const existingLike = await Like.findOne({
    targetId: videoId,
    targetType: "Video",
    likedBy: userId,
  });
  console.log("existingLike", existingLike);

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id); // like id
    console.log("existingLike", existingLike);

    const likesCount = await Like.countDocuments({
      targetId: videoId,
      targetType: "Video",
    });
    await deleteCache(`video:${videoId}:user:*`);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false, likesCount, like: existingLike },
          "Video unliked",
        ),
      );
  }

  const likedVideo = await Like.create({
    targetId: videoId,
    targetType: "Video",
    likedBy: userId,
  });
  console.log("likedVideo", likedVideo);

  const likesCount = await Like.countDocuments({
    targetId: videoId,
    targetType: "Video",
  });
  await deleteCache(`video:${videoId}:user:*`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: true, likesCount, like: likedVideo },
        "Video Liked",
      ),
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on tweets
  const { tweetId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    targetId: tweetId,
    targetType: "Tweet",
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id); // like id

    return res
      .status(200)
      .json(new ApiResponse(200, existingLike, "Tweet unliked"));
  }

  const likedTweet = await Like.create({
    targetId: tweetId,
    targetType: "Tweet",
    likedBy: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { likedTweet: likedTweet }, "Tweet Liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  // TODO: toggle like on comment
  const { commentId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    targetId: commentId,
    targetType: "Comment",
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id); // like id
    console.log("existingLike", existingLike);

    return res
      .status(200)
      .json(new ApiResponse(200, existingLike, "Comment Unliked"));
  }

  const likedComment = await Like.create({
    targetId: commentId,
    targetType: "Comment",
    likedBy: userId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { likedComment: likedComment }, "Comment Liked"),
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // TODO: get all liked videos of user
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        targetType: "Video",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "targetId",
        foreignField: "_id",
        as: "video",
      },
    },
    { $unwind: "$video" },
    {
      $project: {
        "video._id": 1,
        "video.title": 1,
        "video.thumbnail": 1,
        "video.views": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
