import { useState } from "react";
import { Send } from "lucide-react";
import { useAskAi } from "../../hooks/useAskAi";

interface AskAiTabProps {
  videoId: string;
  isAvailable: boolean;
}

const AskAiTab = ({ videoId, isAvailable }: AskAiTabProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useAskAi();

  const handleAsk = () => {
    if (!question.trim() || !isAvailable) return;

    setError("");
    mutate(
      { videoId, question },
      {
        onSuccess: (data) => {
          setAnswer(data.response);
          setQuestion("");
        },
        onError: (err: any) =>
          setError(err.response?.data?.message || "Unable to ask AI."),
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="vt-card min-h-48 p-5">
        {!isAvailable ? (
          <p className="text-[var(--text-muted)] text-sm">
            Ask AI is disabled for this video.
          </p>
        ) : answer ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
            {answer}
          </p>
        ) : (
          <p className="text-[var(--text-muted)] text-sm">
            Ask anything about this video...
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAsk();
          }}
          disabled={!isAvailable || isPending}
          placeholder="What is this video about?"
          className="vt-input flex-1"
        />
        <button
          onClick={handleAsk}
          disabled={!isAvailable || isPending || !question.trim()}
          className="vt-button-primary py-3"
        >
          <Send size={15} />
          {isPending ? "Asking..." : "Ask"}
        </button>
      </div>
    </div>
  );
};

export default AskAiTab;
