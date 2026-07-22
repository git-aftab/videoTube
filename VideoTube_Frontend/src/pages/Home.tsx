import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Flag,
  History,
  HomeIcon,
  Menu,
  Tv2,
  UserRound,
  VideoOff,
} from "lucide-react";

import VideoCards from "../components/ui/VideoCards";
import FilterBar from "../components/ui/FilterBar";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";

import { useVideos } from "../hooks/useVideos";

const Home = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const [page] = useState(1);
  const [sortBy] = useState("createdAt");

  const { data, isLoading, isError, error } = useVideos({
    page,
    search,
    sortBy,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  if (!data?.docs.length) {
    return (
      <div className="vt-page flex flex-1 items-center justify-center px-4">
        <div className="vt-card flex max-w-md flex-col items-center px-8 py-10 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <VideoOff size={24} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            No videos found
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Try a different search or come back when new videos are uploaded.
          </p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { label: "Home", icon: HomeIcon, active: true },
    { label: "Watch History", icon: History },
    { label: "Subscriptions", icon: Tv2 },
    { label: "You", icon: UserRound },
    { label: "Report", icon: Flag },
  ];

  return (
    <div className="vt-page">
      <div className="vt-container grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-20 hidden h-fit flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 lg:flex">
          <div className="mb-1 flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <Menu size={15} />
            Browse
          </div>

          {sidebarItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        <section className="flex min-w-0 flex-col gap-4">
          <FilterBar />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.docs.map((video) => (
              <VideoCards key={video._id} video={video} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
