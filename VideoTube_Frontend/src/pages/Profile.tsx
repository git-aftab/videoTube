import React, {useEffect, useState, useRef, use } from "react";
import { MdEdit } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/auth.context";

const Profile = () => {
  const {user} = useAuth();
  console.log(user)

  const inputImgRef = useRef<HTMLInputElement | null>(null);
  const [bannerimg, setBannerimg] = useState<string | null>(user?.coverImage);
  const [profileImg, setProfileImg] = useState<string | null>(user?.avatar);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!user) return;

    setBannerimg(user.coverImage);
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

  return (
    <div className="flex flex-col w-full">
      <div className="relative h-25 bg-(--bg-elevated) w-full outline-none border-none">
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
      <div className="flex h-30 w-full ">
        <img src={profileImg || ''} alt="" className="-mt-5 z-10 h-full rounded-full mx-3 "/>
        <div className="py-4">
          <h1 className="text-xl tracking-wide ">{user?.fullName}</h1>
          <h1 className="text-xs tracking-wide text-(--text-muted)">@{user?.username}</h1>
          <h1 className="text-(--text-muted) text-sm ">13.5k Subscriber</h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;
