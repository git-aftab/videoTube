import { Heart, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/auth.context";
import {
  useAddComment,
  useDelComment,
  useGetComments,
  useUpdateComment,
} from "../../hooks/useComments";
import { useState } from "react";
import { useToggleCommentLike } from "../../hooks/useSocialActions";
import type { Comment } from "../../types";

const CommentItem = ({
  comment,
  videoId,
}: {
  comment: Comment;
  videoId: string;
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [liked, setLiked] = useState(false);
  const { mutate: deleteComment } = useDelComment(videoId);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(videoId);
  const { mutate: toggleCommentLike, isPending: isLiking } =
    useToggleCommentLike();

  const saveComment = () => {
    if (!draft.trim()) return;
    updateComment(
      { videoId, commentId: comment._id, content: draft },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <div className="flex gap-3">
      {comment.owner.avatar ? (
        <img
          src={comment.owner.avatar}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-muted)] shrink-0">
          {comment.owner.fullName?.[0]?.toUpperCase()}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-(--text-muted)">
            {comment.owner.username}
          </span>
          <span className="text-xs text-(--text-muted)">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <button
                onClick={saveComment}
                disabled={isUpdating || !draft.trim()}
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(false);
                }}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-(--text-primary) mt-1">
            {comment.content}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() =>
              toggleCommentLike(comment._id, {
                onSuccess: () => setLiked((prev) => !prev),
              })
            }
            disabled={isLiking}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
              liked
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--accent)]"
            }`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            Like
          </button>

          {user?._id === comment.owner._id && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                <Pencil size={13} />
                Edit
              </button>
              <button
                onClick={() =>
                  deleteComment({ videoId, commentId: comment._id })
                }
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentTab = ({ videoId }: { videoId: string }) => {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useGetComments(videoId);
  const { mutate: addComment, isPending } = useAddComment(videoId);

  const handleSubmit = () => {
    if (!content.trim()) return;

    addComment({ videoId, content }, { onSuccess: () => setContent("") });
  };

  return (
    <div className="space-y-4">
      {isAuthenticated ? (
        <div
          className="flex flex-col gap-2
        "
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none transition-colors"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isPending || !content.trim()}
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <p className="text-(--text-muted) text-sm">Sign in to comment</p>
      )}

      {/* Comments */}
      {isLoading ? (
        <p className="text-(--text-muted) text-sm">Loading Comments...</p>
      ) : !comments?.length ? (
        <p className="text-(--text-muted) text-sm">
          No Comments yet Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} videoId={videoId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentTab;
