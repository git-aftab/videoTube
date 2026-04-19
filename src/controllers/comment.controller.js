import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";
// import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const comments = await Comment.aggregate([
    //match comments of this video
    {
      $match: {
        Video: new mongoose.Types.ObjectId(videoId),
      },
    },
    //sort latest first
    {
      $sort: { createdAt: -1 },
    },
    //pagination
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
    //Join User(Owner)
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    // select only required field
    {
      $project: {
        content: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Comment cannot be empty.");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Cannot find the video");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user._id,
  });
  if (!comment) {
    throw new ApiError(400, "Cannot upload the comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { comment: comment }, "Comment Added Successfully."),
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "Content Cannot be EMPTY!");
  }

  const existingComment = req.doc;

  if (existingComment.content === content) {
    return res
      .status(200)
      .json(new ApiResponse(200, existingComment, "No Changes Detected in comment"));
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: content },
    { new: true, runValidators: true },
  );

  if (!updatedComment) {
    throw new ApiError(500, "Error updating Comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedComment: updatedComment },
        "Comment updated Successfully",
      ),
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  //verifying ownership in route
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment Not Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedComment: deletedComment },
        "Comment deleted successfully",
      ),
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
