import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { Comment } from "../models/comment.models.js";
// import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
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
      .json(new ApiResponse(200, existingComment, "No Changes Detected"));
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: content },
    { new: true, runValidators: true },
  );

  if (!updatedComment) {
    throw new ApiError(400, "Error updating Comment");
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

  const deletedComment = await Comment.findByIdAndDelete(commentId);
});

export { getVideoComments, addComment, updateComment, deleteComment };
