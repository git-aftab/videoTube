import { Heart, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/auth.context";
import {
  useAddComment,
  useDelComment,
  useGetComments,
  useUpdateComment,
} from "../../hooks/useComments";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToggleCommentLike } from "../../hooks/useSocialActions";
import type { Comment } from "../../types";

const CommentItem = ({
  comment,
  videoId,
}: {
  comment: Comment;
  videoId: string;
}) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
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

  const handleLike = () => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    toggleCommentLike(comment._id, {
      onSuccess: () => setLiked((prev) => !prev),
    });
  };

  return (
    <div className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      {comment.owner.avatar ? (
        <img
          src={comment.owner.avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-[var(--bg-elevated)]"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)]">
          {comment.owner.fullName?.[0]?.toUpperCase()}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            @{comment.owner.username}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {new Date(comment.createdAt).toLocaleDateString()}
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
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
            {comment.content}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={isLiking || isAuthLoading}
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
        <div className="vt-card flex flex-col gap-3 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="vt-input resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
              className="vt-button-primary"
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      ) : (
        <p className="vt-card px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          Sign in to comment.
        </p>
      )}

      {/* Comments */}
      {isLoading ? (
        <p className="vt-card px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          Loading comments...
        </p>
      ) : !comments?.length ? (
        <p className="vt-card px-4 py-8 text-center text-sm text-[var(--text-muted)]">
          No comments yet. Be the first!
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
