import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Video", "Comment", "Tweet"],
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

likeSchema.index({ targetId: 1, targetType: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
