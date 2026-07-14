const AskAiTab = ({ videoId: _videoId }: { videoId: string }) => {
  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-4 min-h-48 flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-sm">
          Ask anything about this video...
        </p>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="What is this video about?"
          className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors">
          Ask
        </button>
      </div>
    </div>
  );
}

export default AskAiTab
