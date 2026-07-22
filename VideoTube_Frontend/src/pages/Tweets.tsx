import { useState } from "react";
import { Heart, Pencil, Send, Trash2, X } from "lucide-react";
import { useAuth } from "../contexts/auth.context";
import {
  useCreateTweet,
  useDeleteTweet,
  useTweets,
  useUpdateTweet,
  useUserTweets,
} from "../hooks/useTweets";
import { useToggleTweetLike } from "../hooks/useSocialActions";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import type { Tweet } from "../types";

const TweetItem = ({ tweet }: { tweet: Tweet }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(tweet.content);
  const [liked, setLiked] = useState(false);
  const { mutate: updateTweet, isPending: isUpdating } = useUpdateTweet();
  const { mutate: deleteTweet, isPending: isDeleting } = useDeleteTweet();
  const { mutate: toggleLike, isPending: isLiking } = useToggleTweetLike();
  const isOwner = user?._id === tweet.owner?._id;

  const saveEdit = () => {
    if (!draft.trim()) return;
    updateTweet(
      { tweetId: tweet._id, content: draft },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 shadow-lg shadow-black/10">
      <div className="flex items-start gap-3">
        {tweet.owner?.avatar ? (
          <img
            src={tweet.owner.avatar}
            alt={tweet.owner.username}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)]" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">@{tweet.owner?.username}</span>
            <span className="text-xs text-[var(--text-muted)]">
              {new Date(tweet.createdAt || tweet.createdAte || Date.now()).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="vt-input resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  disabled={isUpdating || !draft.trim()}
                  className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setDraft(tweet.content);
                    setIsEditing(false);
                  }}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-primary)]">
              {tweet.content}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() =>
                toggleLike(tweet._id, { onSuccess: () => setLiked((prev) => !prev) })
              }
              disabled={isLiking}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors ${
                liked
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--accent)]"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
              Like
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => deleteTweet(tweet._id)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--error)] disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const Tweets = () => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [showMine, setShowMine] = useState(false);
  const { data: tweets = [], isLoading, isError, error } = useTweets();
  const { data: myTweets = [] } = useUserTweets(user?._id);
  const { mutate: createTweet, isPending } = useCreateTweet();
  const visibleTweets = showMine ? myTweets : tweets;

  const handleCreate = () => {
    if (!content.trim()) return;
    createTweet(content, { onSuccess: () => setContent("") });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} />;

  return (
    <div className="vt-page">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="sticky top-16 z-10 -mx-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Tweets
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Short updates from the VideoTube community.
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowMine((prev) => !prev)}
                className="vt-button-ghost shrink-0"
              >
                {showMine ? "All tweets" : "My tweets"}
              </button>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="vt-card my-4 p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Share something..."
              className="vt-input resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleCreate}
                disabled={isPending || !content.trim()}
                className="vt-button-primary"
              >
                {isPending ? <X size={15} /> : <Send size={15} />}
                Post
              </button>
            </div>
          </div>
        )}

        {!visibleTweets.length ? (
          <p className="vt-card px-4 py-10 text-center text-sm text-[var(--text-muted)]">
            No tweets yet.
          </p>
        ) : (
          <div className="space-y-3">
            {visibleTweets.map((tweet) => (
              <TweetItem key={tweet._id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;
