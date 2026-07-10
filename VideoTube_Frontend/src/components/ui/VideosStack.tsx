// import React from 'react'
import type { Video } from "@/types";
import { formatTimeAgo } from "../../utils/formatTime.ts";
import { useNavigate } from "react-router-dom";

interface VideosStackProp {
  videos: Video[];
}

const VideosStack = ({ videos }: VideosStackProp) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col gap-3 md:px-6 ">
        {videos.map((video) => (
          <div
            onClick={() => navigate(`/watch/${video._id}`)}
            key={video._id}
            className="flex gap-2 h-22 sm:h-36 md:h-44 lg:h-56 hover:bg-accent/10 rounded"
          >
            <img
              key={video._id}
              src={video.thumbnail || ""}
              alt=""
              className="aspect-video border-none outline-none rounded"
            />
            <div className="">
              <h1 className="text-sm sm:text-xl lg:text-2xl">{video.title}</h1>
              <div className="flex gap-3 text-xs sm:text-xl lg:text-2xl text-(--text-muted) ">
                <p className="">{video.views} views</p>
                <p className="">• {formatTimeAgo(video.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosStack;
