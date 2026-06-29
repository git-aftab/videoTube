import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCards from "../components/ui/VideoCards";
import FilterBar from "../components/ui/FilterBar";
import { GiHamburgerMenu } from "react-icons/gi";


const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  return (
    <main className="relative grid md:grid-cols-7  bg-(--bg-primary) py-6 text-(--text-primary) px-6 space-y-6">
      <aside className="hidden lg:flex flex-col col-span-1 gap-x-3">
        <div className="">
          <GiHamburgerMenu size={24} />
        </div>
        <div className="flex flex-col gap-y-3">
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">HOME</h1>
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">Watch HISTORY</h1>
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">SUBSCRIPTIONS</h1>
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">YOU</h1>
          <h1 className="text-sm border-t border-(--text-muted)"></h1>
          <h1 className="font-bold hover:bg-accent border border-border rounded-lg py-2 px-3">REPORT</h1>
        </div>
      </aside>
      <div className=" relative col-span-6 flex flex-col gap-y-3 ">
        <div className="">
          <FilterBar />
        </div>
        <div className="flex flex-col justify-center mb-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
            <VideoCards />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
