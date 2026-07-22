import type { Video } from '@/types';

const DescriptionTab = ({video}: {video: Video}) => {
  return (
    <div className="vt-card p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
        <span>{video.views.toLocaleString()} views</span>
        <span className="text-[var(--accent)]">•</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
        {video.description || "No description provided."}
      </p>
    </div>
  );
}

export default DescriptionTab
