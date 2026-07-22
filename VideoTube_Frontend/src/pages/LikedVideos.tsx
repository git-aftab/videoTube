import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useLikedVideos } from "../hooks/useSocialActions";
import img from "../assets/website_profile_img03.png";

const LikedVideos = () => {
  const { data: videos = [], isLoading, isError, error } = useLikedVideos();
  const navigate = useNavigate();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} />;

  return (
    <div className="vt-page">
      <div className="vt-container">
        <div className="mb-5">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-primary)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Heart size={20} />
            </span>
            Liked videos
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Videos you saved with a like.
          </p>
        </div>

      {videos.length ? (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <button
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="group flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2 text-left shadow-lg shadow-black/10 transition-colors hover:border-[var(--accent)]"
            >
              <img
                src={video.thumbnail || img}
                alt={video.title}
                className="aspect-video w-32 shrink-0 rounded-xl object-cover sm:w-48"
              />
              <div className="min-w-0 py-1">
                <h2 className="line-clamp-2 font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">{video.title}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {video.views?.toLocaleString?.() ?? 0} views
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="vt-card px-4 py-10 text-center text-sm text-[var(--text-muted)]">
          No liked videos yet.
        </p>
      )}
      </div>
    </div>
  );
};

export default LikedVideos;
