import React from 'react'
import {
  BiLike,
  BiSolidLike,
  BiDislike,
  BiSolidDislike,
  BiSolidCommentDetail,
} from "react-icons/bi";
import { FaShare, FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";

import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";


const VideoInteractions = () => {
  return (
    <div className="interactions flex justify-between text-xl sm:text-2xl px-4 py-4 items-center bg-(--bg-elevated)">
      <div className="flex gap-5 cursor-pointer">
        <BiLike />
        <BiDislike />
        <FaRegBookmark />
        <FaShare />
      </div>
      <div className="">
        {/* <img src="" alt="" /> */}
        <button className="flex items-center gap-3 bg-accent px-3 py-2 rounded-full hover:bg-accent/70 cursor-pointer">
          <h1 className="text-sm sm:text-xl">Subscribe</h1>
          <CiCirclePlus />
        </button>
      </div>
    </div>
  );
}

export default VideoInteractions