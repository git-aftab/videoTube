import { motion } from "framer-motion";
import img from "../../assets/website_profile_img03.png";
import type { Video } from "../../types";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/formatTime";

interface VideoCardsProps {
  video: Video;
}

const videoCards = ({ video }: VideoCardsProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-accent/20"
      key={video._id}
      onClick={() => navigate(`watch/${video._id}`)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-elevated)]">
        <img
          src={video.thumbnail || img}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex gap-3 border-t border-[var(--border)] p-3">
        {video.ownerDetails?.avatar ? (
          <img
            src={video.ownerDetails.avatar}
            alt={video.ownerDetails.username}
            className="mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-[var(--bg-elevated)]"
          />
        ) : (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-muted)]">
            {video.ownerDetails?.username?.[0]?.toUpperCase() || "V"}
          </div>
        )}

        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-primary)]">
            {video.title.trim()}
          </p>
          <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
            @{video.ownerDetails?.username || "creator"}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {video.views.toLocaleString()} views ·{" "}
            {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default videoCards;
