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
    <div className="w-full">
      <div className="border-b border-[var(--border)] px-4 py-5 md:px-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Heart size={22} className="text-[var(--accent)]" />
          Liked videos
        </h1>
      </div>

      {videos.length ? (
        <div className="flex flex-col gap-3 px-4 py-4 md:px-8">
          {videos.map((video) => (
            <button
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-left hover:border-[var(--accent)]"
            >
              <img
                src={video.thumbnail || img}
                alt={video.title}
                className="aspect-video w-32 rounded-lg object-cover sm:w-48"
              />
              <div className="min-w-0 py-1">
                <h2 className="font-semibold">{video.title}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {video.views?.toLocaleString?.() ?? 0} views
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
          No liked videos yet.
        </p>
      )}
    </div>
  );
};

export default LikedVideos;
