import type { Video } from '@/types';
import React from 'react'

const DescriptionTab = ({video}: {video: Video}) => {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 space-y-4">
      <div className="flex gap-4 text-sm text-[var(--text-muted)]">
        <span>{video.views.toLocaleString()} views</span>
        <span>•</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
        {video.description || "No description provided."}
      </p>
    </div>
  );
}

export default DescriptionTab