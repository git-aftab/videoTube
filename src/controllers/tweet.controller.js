import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is needed.");
  }

  const tweet = await Tweet.create({
    content: content,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const tweets = await Tweet.aggregate([
    //match tweets of user
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      //sort latest first
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
    //lookup user info
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    //flatten owner
    {
      $unwind: "$owner",
    },
    //clean o/p
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet cannot be empty");
  }

  const existingTweet = req.doc;
  console.log("Existing tweet", existingTweet);

  if (existingTweet.content === content) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingTweet, "No changes detected in tweet"),
      );
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true, runValidators: true },
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Error updating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  // checking ownership in routes
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted Successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.aggregate([
    //sort latest first
    {
      $sort: { createdAt: -1 },
    },
    // pagination
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    //flatten owner
    {
      $unwind: "$owner",
    },
    // response structure
    {
      $project: {
        content: 1,
        createdAte: 1,
        updatedAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "All tweets fetched successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
