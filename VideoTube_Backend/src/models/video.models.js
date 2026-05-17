import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      // required: true,
      default: "",
    },
    thumbnail: {
      type: String, // cloudinary
      default: "",
    },
    processingStatus: {
      type: String,
      enum: ["PROCESSING", "READY", "FAILED"],
      default: "PROCESSING",
    },
    audioProcessingError: {
      type: String,
      default: null,
    },
    audioFile: {
      type: String,
      default: "",
    },
    transcript: {
      type: String,
      default: "",
    },
    detectedLanguage: {
      type: String,
      default: "",
    },
    transcriptionSegment: {
      type: Array, // timestamped segments for chapter generation later
      default: [],
    },
    transcriptionStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "NO_AUDIO"],
      default: "PENDING",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    duration: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
