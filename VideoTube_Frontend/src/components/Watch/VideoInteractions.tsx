import { useEffect, useState } from "react";
import { BiLike, BiSolidLike, BiDislike } from "react-icons/bi";
import { FaShare, FaRegBookmark } from "react-icons/fa6";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useAuth } from "../../contexts/auth.context";
import { useNavigate } from "react-router-dom";
import { useLikeVideo } from "../../hooks/useLikeVideo";
import { useToggleSubscription } from "../../hooks/useSocialActions";

interface VideoInteractionsProps {
  videoId: string;
  ownerDetails: {
    _id: string;
    username: string;
    avatar?: string;
    fullName?: string;
  };
  initialIsLiked?: boolean;
  initialIsLikesCounts?: number;
  initialisSubscribed?: boolean;
}

const VideoInteractions = ({
  videoId,
  ownerDetails,
  initialIsLiked = false,
  initialIsLikesCounts = 0,
  initialisSubscribed = false,
}: VideoInteractionsProps) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { mutate: toggleLike, isPending } = useLikeVideo();
  const { mutate: toggleSubscription, isPending: isSubscriptionPending } =
    useToggleSubscription();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialIsLikesCounts);
  const [isSubscribed, setIsSubscribed] = useState(initialisSubscribed);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialIsLikesCounts);
    setIsSubscribed(initialisSubscribed);
  }, [initialIsLiked, initialIsLikesCounts, initialisSubscribed, videoId]);

  const handleLike = () => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    toggleLike(videoId, {
      onError: () => {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      },
    });
  };

  const handleSubscribe = () => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsSubscribed((prev) => !prev);

    toggleSubscription(ownerDetails._id, {
      onError: () => setIsSubscribed((prev) => !prev),
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <div className="flex flex-col gap-4 bg-[var(--bg-secondary)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleLike}
          disabled={isPending || isAuthLoading}
          className="vt-button-ghost px-3 py-2 disabled:opacity-50"
        >
          {isLiked ? <BiSolidLike className="text-accent" /> : <BiLike />}
          <span className="text-sm">{likesCount}</span>
        </button>
        <button className="vt-button-ghost px-3 py-2">
          <BiDislike />
        </button>
        <button className="vt-button-ghost px-3 py-2">
          <FaRegBookmark />
        </button>
        <button
          onClick={handleShare}
          className="vt-button-ghost px-3 py-2"
        >
          <FaShare />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex min-w-0 items-center gap-3">
          {ownerDetails.avatar ? (
            <img
              src={ownerDetails.avatar}
              alt={ownerDetails.username}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--bg-elevated)]"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-muted)]">
              {ownerDetails.username?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {ownerDetails.fullName || ownerDetails.username}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              @{ownerDetails.username}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isSubscriptionPending || isAuthLoading}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 disabled:opacity-50
          ${isSubscribed ? "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]" : "bg-[var(--accent)] text-white shadow-lg shadow-accent/20 hover:bg-[var(--accent-hover)]"}`}
        >
          {isSubscribed ? (
            <>
              <CiCircleMinus size={18} /> Subscribed
            </>
          ) : (
            <>
              <CiCirclePlus size={18} /> Subscribe
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoInteractions;
