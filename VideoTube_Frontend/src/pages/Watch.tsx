import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BiLike,
  BiSolidLike,
  BiDislike,
  BiSolidDislike,
  BiSolidCommentDetail,
} from "react-icons/bi";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { RiRobot3Fill } from "react-icons/ri";

import { useVideos } from "../hooks/useVideos";
import VideosStack from "../components/ui/VideosStack";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const Watch = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const [sortBy, setsortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  const { data, isError, error, isLoading } = useVideos({
    page,
    search,
    sortBy,
  });
  console.log(data);
  const videos = data?.docs;
  console.log(videos);

  if(isLoading){
    return <LoadingState></LoadingState>
  }

  if(isError){
    return <ErrorState message={error.message}/>
  }

  return (
    <div className="h-full w-full">
      <div className="screen flex justify-center items-center aspect-video mb-2">
        Screen
      </div>

      <div className="title border-t border-(--border) ">
        <h1 className="text-xl md:text-2xl mb-2 px-4 py-3">Title</h1>
        <p className="text-(--text-muted) text-xs sm:text-[16px] border border-(--border) px-4 py-2.5 rounded-xl">
          Desc
        </p>
      </div>
      <div className="interactions flex justify-between text-xl sm:text-2xl px-4 py-4 items-center bg-(--bg-elevated)">
        <div className="flex gap-5 cursor-pointer">
          <BiLike />
          <BiDislike />
          <BiSolidCommentDetail />
          <RiRobot3Fill />
        </div>
        <button className="flex items-center gap-3 bg-accent px-3 py-2 rounded-full hover:bg-accent/70 cursor-pointer">
          <h1 className="text-sm sm:text-xl">Subscribe</h1>
          <CiCirclePlus />
        </button>
      </div>
      <div className="comment my-5 px-4 border border-(--border) py-3 rounded-2xl text-sm sm:text-[16px]">I'm Comment</div>
      <div className="px-4 sm:px-0">
        <VideosStack videos={videos} />
      </div>
    </div>
  );
};

export default Watch;
