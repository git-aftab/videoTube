import React, { useEffect, useState, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/auth.context";
import { useUserVideos } from "../hooks/useUserVideos";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import VideosStack from "../components/ui/VideosStack";


const Profile = () => {
  const { user } = useAuth();
  console.log(user);

  const inputImgRef = useRef<HTMLInputElement | null>(null);
  const [bannerimg, setBannerimg] = useState<string | null>(user?.coverImage);
  const [profileImg, setProfileImg] = useState<string | null>(user?.avatar);
  const [Error, setError] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (!user) return;

    setBannerimg(user?.coverImage);
    setProfileImg(user.avatar);
  }, [user]);

  const openFilePicker = () => {
    console.log("ran file picker");

    inputImgRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    console.log(file);

    if (!file) {
      setError("Please upload a file");
      return;
    }
    setBannerimg(URL.createObjectURL(file));
  };

  const handleSubmit = () => {};

  const { data, isError, isLoading, error } = useUserVideos(user?._id);
  // console.log("data from profile videos:", data);
  const videos = data?.videos ?? [];
  // console.log(videos);

  const sortedVideos = [...videos].sort((a, b) =>
    sortBy === "latest"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="relative h-28 sm:h-36 md:h-44 lg:h-56 bg-(--bg-elevated) w-full outline-none border-none">
        <input
          type="file"
          ref={inputImgRef}
          onChange={handleChange}
          className="hidden"
        />
        <img
          src={bannerimg || ""}
          alt="Banner Image"
          className="h-full w-full outline-none border-none object-cover"
        />
        <div className="absolute text-xl md:text-2xl top-0 right-0 bg-(--accent-soft) p-3 rounded-full hover:bg-accent/50">
          <MdEdit onClick={openFilePicker} />
        </div>
      </div>
      <div className="flex h-28 sm:h-36 md:h-44 lg:h-56 w-full border-b border-accent-foreground bg-(--bg-elevated)/50 mb-3">
        <img
          src={profileImg || ""}
          alt=""
          className="-mt-5 z-10 h-full rounded-full mx-3 md:mx-6"
        />
        <div className="py-4 flex flex-col justify-center ">
          <h1 className="text-xl tracking-wide  md:text-2xl">
            {user?.fullName}
          </h1>
          <h1 className="text-xs md:text-sm tracking-wide text-(--text-muted)">
            @{user?.username}
          </h1>
          <h1 className="text-(--text-muted) text-sm ">13.5k Subscriber</h1>
        </div>
      </div>

      {/* Videos Filter */}
      <div className="ml-3 flex gap-4 mb-3">
        <h1 className="px-3 py-2 border border-accent/30 rounded">Videos</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-border px-3 py-2 rounded"
        >
          <option
            value="latest"
            className="text-(--text-primary) bg-(--bg-primary)"
          >
            Latest
          </option>
          <option
            value="oldest"
            className="text-(--text-primary) bg-(--bg-primary)"
          >
            Oldest
          </option>
        </select>
      </div>

      {/* Videos */}
      <VideosStack videos={sortedVideos}/>
    </div>
  );
};

export default Profile;
