// import React from 'react'
import type { Video } from "@/types";
import { formatTimeAgo } from "../../utils/formatTime.ts";
import { useNavigate } from "react-router-dom";
import img from "../../assets/website_profile_img03.png";

interface VideosStackProp {
  videos: Video[];
}

const VideosStack = ({ videos }: VideosStackProp) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        More videos
      </h2>
      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <div
            onClick={() => navigate(`/watch/${video._id}`)}
            key={video._id}
            className="group flex cursor-pointer gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2 transition-colors hover:border-[var(--accent)]"
          >
            <img
              key={video._id}
              src={video.thumbnail || img || undefined}
              alt={video.title}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="aspect-video w-32 shrink-0 rounded-xl object-cover sm:w-48 md:w-56"
            />
            <div className="min-w-0 py-1">
              <h1 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-base">
                {video.title}
              </h1>
              <h1 className="mt-1 truncate text-xs text-[var(--text-muted)] sm:text-sm">
                @{video.ownerDetails.username}
              </h1>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] sm:text-sm">
                <p>{video.views.toLocaleString()} views</p>
                <p>• {formatTimeAgo(video.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosStack;
