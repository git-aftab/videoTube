const LoadingState = () => {
  return (
    <div className="vt-page flex flex-1 items-center justify-center px-4">
      <div className="vt-card flex flex-col items-center gap-5 px-10 py-12">
        <div className="flex h-16 aspect-video animate-pulse items-center justify-center rounded-xl bg-[var(--accent)] shadow-lg shadow-accent/40">
          <svg className="h-10 w-10" viewBox="0 0 100 100" fill="white">
            <polygon points="30,20 30,80 80,50" />
          </svg>
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default LoadingState;
