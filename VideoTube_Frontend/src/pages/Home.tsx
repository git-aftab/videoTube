import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCards from "../components/videoCards/VideoCards";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <main className="relative bg-(--bg-primary) py-6 text-(--text-primary) px-6 space-y-6">
      {/* <aside className="hidden sm:flex flex-col ">

      </aside> */}
      <div className="flex flex-col justify-center mb-6">
        <h1 className=" mb-3 text-3xl font-bold tracking-tight flex items-center border-b border-(--accent-soft)">
          Currently Trendings{" "}
          <span className="">
            <FaArrowTrendUp size={24} className="text-accent" />
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="">
            <VideoCards />
          </div>
          <div className="">
            <VideoCards />
          </div>
          <div className="">
            <VideoCards />
          </div>
          <div className="">
            <VideoCards />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mb-6">
        <h1 className="text-(--text-primary) text-3xl font-bold tracking-tight flex items-center border-b border-(--accent-soft)">
          Recomendations{" "}
          <FaHeart size={24} fill="#7c3aed" color="#7c3aed" className="" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
          <div className="">
            <VideoCards/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
