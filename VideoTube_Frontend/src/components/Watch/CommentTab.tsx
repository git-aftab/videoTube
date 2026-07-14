import { Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/auth.context";
import {
  useAddComment,
  useDelComment,
  useGetComments,
} from "../../hooks/useComments";
import { useState } from "react";

const CommentTab = ({ videoId }: { videoId: string }) => {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useGetComments(videoId);
  const { mutate: addComment, isPending } = useAddComment(videoId);
  const { mutate: deleteComment } = useDelComment(videoId);

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
            <div key={comment._id} className="flex gap-3">
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

              {/* content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-(--text-muted)">
                    {comment.owner.username}
                  </span>
                  <span className="text-xs text-(--text-muted)">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-(--text-primary) mt-1">
                  {comment.content}
                </p>
              </div>
              {user?._id === comment.owner._id && (
                <button
                  onClick={() =>
                    deleteComment({ videoId, commentId: comment._id })
                  }
                  className="text-(--text-muted) hover:text-[var(--error)] transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentTab;
