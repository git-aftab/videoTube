import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCards from "../components/ui/VideoCards";
import FilterBar from "../components/ui/FilterBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { useVideos } from "../hooks/useVideos";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";


const Home = () => {
  const [seacrhParams] = useSearchParams();
  const search = seacrhParams.get("search") || undefined;

  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const { data, isError, isLoading, error } = useVideos({
    page,
    search,
    sortBy,
  });

  if (isLoading) {
    return (
      <main>
        <LoadingState/>
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <ErrorState message={error.message} />
      </main>
    )
  }

  if (!data?.docs.length) {
    return <div className="text-(--text-muted)">No Videos Found</div>;
  }

  return (
    <main className="relative grid md:grid-cols-7  bg-(--bg-primary) py-6 text-(--text-primary) px-6 gap-3">
      <aside className="hidden lg:flex flex-col col-span-1 gap-x-3">
        <div className="">
          <GiHamburgerMenu size={24} />
        </div>
        <div className="flex flex-col gap-y-3">
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
          <h1 className="text-sm border-t border-(--text-muted)"></h1>
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">
            REPORT
          </h1>
        </div>
      </aside>
      <div className=" relative col-span-6 flex flex-col gap-y-3 ">
        <div className="">
          <FilterBar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.docs.map((video) => (
            <VideoCards key={video._id} video={video} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
