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
  const { isAuthenticated } = useAuth();
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
    <div className="flex justify-between items-center text-xl sm:text-2xl px-4 py-3 bg-(--bg-elevated) border-t border-(--border)">
      <div className="flex items-center gap-5">
        <button
          onClick={handleLike}
          disabled={isPending}
          className="flex items-center gap-1.5 text-(--text-muted) hover:text-accent transition-colors duration-200 disabled:opacity-50"
        >
          {isLiked ? <BiSolidLike className="text-accent" /> : <BiLike />}
          <span className="text-sm">{likesCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-(--text-muted) hover:text-accent transition-colors duration-200 disabled:opacity-50">
          <BiDislike />
        </button>
        <button className="flex items-center gap-1.5 text-(--text-muted) hover:text-accent transition-colors duration-200 disabled:opacity-50">
          <FaRegBookmark />
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-(--text-muted) hover:text-accent transition-colors duration-200 disabled:opacity-50"
        >
          <FaShare />
        </button>
      </div>
      <div className="flex items-center gap-3">
        {ownerDetails.avatar ? (
          <img
            src={ownerDetails.avatar}
            alt={ownerDetails.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-(--bg-primary) border border-(--border) flex items-center justify-center text-xs text-(--text-muted)">
            {ownerDetails.username?.[0]?.toUpperCase()}
          </div>
        )}
        {/* hidden username for moble */}
        <span className="hidden sm:block text-sm text-[var(--text-muted)]">
          @{ownerDetails.username}
        </span>

        <button
          onClick={handleSubscribe}
          disabled={isSubscriptionPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 
          ${isSubscribed ? "bg-(--bg-elevated) border border-(--border) text-(--text-muted) hover:border-accent hover:text-accent" : "bg-accent hover:bg-(--accent-soft) text-white"}`}
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
