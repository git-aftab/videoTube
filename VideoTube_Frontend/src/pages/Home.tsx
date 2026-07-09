import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import VideoCards from "../components/ui/VideoCards";
import FilterBar from "../components/ui/FilterBar";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";

import { useVideos } from "../hooks/useVideos";

const Home = () => {
  const navigate = useNavigate();

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
      <div className="flex-1 flex items-center justify-center text-(--text-muted)">
        No Videos Found
      </div>
    );
  }

  return (
    <div className="w-full grid md:grid-cols-7 bg-(--bg-primary) py-6 px-6 text-(--text-primary) gap-3">
      <aside className="hidden lg:flex flex-col col-span-1 gap-y-3">
        <GiHamburgerMenu size={24} />

        <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
          HOME
        </h1>

        <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
          Watch HISTORY
        </h1>

        <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
          SUBSCRIPTIONS
        </h1>

        <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
          YOU
        </h1>

        <div className="border-t border-(--text-muted)" />

        <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
          REPORT
        </h1>
      </aside>

      <div className="col-span-6 flex flex-col gap-3">
        <FilterBar />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.docs.map((video) => (
            <VideoCards key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
