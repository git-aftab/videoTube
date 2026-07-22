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

  const transcriptWordCount = currVideo.transcript?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const isAiAvailable = transcriptWordCount > 10;

  return (
    <div key={videoId} className="vt-page">
      <div className="vt-container max-w-6xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-2xl shadow-black/40">
          <video
            key={videoId}
            src={currVideo.videoFile}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black"
          ></video>
        </div>

        <section className="vt-card overflow-hidden">
          <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
            <h1 className="text-xl font-bold leading-tight text-[var(--text-primary)] md:text-2xl">
              {currVideo.title}
            </h1>
          </div>

          <VideoInteractions
            videoId={currVideo._id}
            ownerDetails={currVideo.ownerDetails}
            initialIsLiked={currVideo.isLiked}
            initialIsLikesCounts={currVideo.likesCount}
            initialisSubscribed={currVideo.isSubscribed}
          />
        </section>

        <VideoTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAiAvailable={isAiAvailable}
        />

        <section>
          {activeTab === "description" && <DescriptionTab video={currVideo} />}
          {activeTab === "comment" && <CommentTab videoId={currVideo._id} />}
          {activeTab === "ai" && (
            <AskAiTab videoId={currVideo._id} isAvailable={isAiAvailable} />
          )}
          {activeTab === null && <VideosStack videos={videos} />}
        </section>
      </div>
    </div>
  );
};

export default Watch;
