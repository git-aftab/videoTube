const LoadingState = () => {
  return (
    <div className="flex-1 w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-16 aspect-video items-center justify-center rounded-xl bg-[#7c3aed] shadow-lg shadow-[#7c3aed]/40 animate-pulse">
          <svg className="h-10 w-10" viewBox="0 0 100 100" fill="white">
            <polygon points="30,20 30,80 80,50" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-(--text-muted)">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default LoadingState;
