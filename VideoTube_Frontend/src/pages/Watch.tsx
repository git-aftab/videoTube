import React, { useState } from "react";
// import {usePara}
import { useSearchParams, useParams } from "react-router-dom";


import { useVideos } from "../hooks/useVideos";
import { useVideoById } from "../hooks/useVideoById";
import { useLikeVideo } from "../hooks/useLikeVideo";
import VideosStack from "../components/ui/VideosStack";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const Watch = () => {
  const [searchParams] = useSearchParams();
  const { videoId } = useParams();
  const search = searchParams.get("search") || undefined;

  const [sortBy, setsortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  const {
    data: recomendedVideos,
    isError,
    error,
    isLoading,
  } = useVideos({
    page,
    search,
    sortBy,
  });
  // console.log(recomendedVideos);
  const videos = recomendedVideos?.docs;
  // console.log(videos);

  const {
    data: currVideo,
    isLoading: isVideoLoading,
    isError: isCurrVideoError,
    error: currVideoError,
  } = useVideoById(videoId);

  // const currVideo = currVideo;
  // console.log(currVideo);


  if (isLoading || isVideoLoading) {
    return <LoadingState></LoadingState>;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }
  if (isCurrVideoError) {
    return <ErrorState message={currVideoError.message} />;
  }

  return (
    <div className="h-full w-full">
      <div className="screen flex justify-center items-center aspect-video mb-2">
        <video
          key={currVideo._id}
          src={currVideo.videoFile}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full"
        ></video>
      </div>

      <div className="title border-t border-(--border) ">
        <h1 className="text-xl md:text-2xl px-4 py-3 bg-(--bg-elevated)">
          {currVideo.title}
        </h1>
        {/* <p className="text-(--text-muted) text-xs sm:text-[16px] border border-(--border) px-4 py-2.5 rounded">
          {currVideo.description}
        </p> */}
      </div>
      

      <div className="px-4 sm:px-0">
        <VideosStack videos={videos} />
      </div>
    </div>
  );
};

export default Watch;
