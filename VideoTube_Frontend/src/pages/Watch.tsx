import { useState } from "react";
// import {usePara}
import { useSearchParams, useParams } from "react-router-dom";

import { useVideos } from "../hooks/useVideos";
import { useVideoById } from "../hooks/useVideoById";
import VideosStack from "../components/ui/VideosStack";
import VideoInteractions from "../components/Watch/VideoInteractions";
import VideoTabs from "../components/Watch/VideoTabs";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import DescriptionTab from "../components/Watch/DescriptionTab";
import CommentTab from "../components/Watch/CommentTab";
import AskAiTab from "../components/Watch/AskAiTab";

const Watch = () => {
  const [searchParams] = useSearchParams();
  const { videoId } = useParams();
  const search = searchParams.get("search") || undefined;

  const sortBy = "createdAt";
  const [activeTab, setActiveTab] = useState<
    "description" | "comment" | "ai" | null
  >(null);
  const page = 1;

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
  const videos = recomendedVideos?.docs ?? [];
  // console.log(videos);

  const {
    data: currVideo,
    isLoading: isVideoLoading,
    isError: isCurrVideoError,
    error: currVideoError,
  } = useVideoById(videoId);

  const handleTabChange = (tab: "description" | "comment" | "ai") => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };
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

  if (!videoId || !currVideo) {
    return <ErrorState message="Video not found" />;
  }

  return (
    <div key={videoId} className="h-full w-full">
      <div className="screen flex justify-center items-center aspect-video mb-2">
        <video
          key={videoId}
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
      </div>

      <div className="">
        <VideoInteractions
          videoId={currVideo._id}
          ownerDetails={currVideo.ownerDetails}
          initialIsLiked={currVideo.isLiked}
          initialIsLikesCounts={currVideo.likesCount}
          initialisSubscribed={currVideo.isSubscribed}
        />
      </div>
      <div className="">
        <VideoTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="px-4 sm:px-0 mt-4">
        {activeTab === "description" && <DescriptionTab video={currVideo} />}
        {activeTab === "comment" && <CommentTab videoId={currVideo._id} />}
        {activeTab === "ai" && <AskAiTab videoId={currVideo._id} />}
        {activeTab === null && <VideosStack videos={videos} />}
      </div>

      {/* <div className="px-4 sm:px-0">
        <VideosStack videos={videos} />
      </div> */}
    </div>
  );
};

export default Watch;
