
const LoadingState = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-(--bg-primary)">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <div className="relative flex items-center justify-center">
          <div className="flex h-14 aspect-video items-center justify-center rounded-xl bg-[#7c3aed] shadow-lg shadow-[#7c3aed]/40 animate-pulse">
            <svg className="h-9 w-9 fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
