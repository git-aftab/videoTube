import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";

// controller
const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  if (channelId === userId.toString()) {
    throw new ApiError(400, "You Cannot Subscribe Yourself!");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(400, "Channel Not Found");
  }

  // Is existing subscriber
  const existingSubs = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubs) {
    await Subscription.findByIdAndDelete(existingSubs._id);

    return res
      .status(200)
      .res.json(
        new ApiResponse(200, existingSubs, "Channel Unsubscribed Successfully"),
      );
  }

  const newSubscription = await Subscription.create({
    subscriberId: userId,
    channel: channelId,
  });

  return res
    .status(201)
    .res.json(
      new ApiResponse(201, newSubscription, "Channel Subscribed Successfully"),
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(404, "Invalid Channel Id");
  }

  const result = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },

    {
      $facet: {
        subscribers: [
          {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          { $unwind: "$subscriber" },

          // flatten response
          {
            $project: {
              _id: "$subscriber._id",
              username: "$subscriber.username",
              avatar: "$subscriber.avatar",
            },
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },

    // normalize count
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Subscriber Fetched Successfully"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const result = await Subscription.aggregate([
    // 1. Match subscriptions of user
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },

    // 2. Facet for list + count
    {
      $facet: {
        channels: [
          // join channel (User)
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
            },
          },
          { $unwind: "$channel" },

          // clean output
          {
            $project: {
              _id: 0,
              "channel._id": 1,
              "channel.username": 1,
              "channel.avatar": 1,
            },
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },

    // 3. Normalize count
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "Subscribed channels fetched"));
});

export { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers };
