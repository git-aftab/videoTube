//Auth
export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  coverImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

// Channel
export interface Channel extends User {
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribedTo: boolean;
}

// Video
export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  duration: number;
  views: number;
  isPublished: boolean;
  ownerDetails: {
    _id: string;
    username: string;
    avatar?: string;
    fullName?: string;
  };
  processingStatus: "READY" | "PROCESSING" | "FAILED";
  transcriptionStatus: "COMPLETED" | "PENDING" | "FAILED";
  transcript?: string;
  createdAt: string;
  updatedAt: string;
  // These come only if backend adds aggregation
  isLiked?: boolean;
  likesCount?: number;
  isSubscribed?: boolean;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt?: string;
  createdAte?: string;
  updatedAt: string;
}

// Comment
export interface Comment {
  _id: string;
  content: string;
  owner: User;
  video: string;
  createdAt: string;
  updatedAt: string;
}

// ── Playlist
export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  videos: Video[];
  owner: User;
  createdAt: string;
}

// ── Like
export interface Like {
  _id: string;
  video?: string;
  comment?: string;
  likedBy: string;
}

// ── Subscription
export interface Subscription {
  _id: string;
  subscriber: string;
  channel: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
