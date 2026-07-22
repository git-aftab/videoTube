import { ListVideo } from "lucide-react";

const Playlist = () => {
  return (
    <div className="vt-page flex flex-1 items-center justify-center px-4">
      <div className="vt-card flex max-w-md flex-col items-center px-8 py-10 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <ListVideo size={24} />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Playlist
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Playlist details will appear here when they are available.
        </p>
      </div>
    </div>
  )
}

export default Playlist
