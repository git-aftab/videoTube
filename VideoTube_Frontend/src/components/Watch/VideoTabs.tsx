import React from 'react'
import { RiRobot3Fill } from "react-icons/ri";

const VideoTabs = () => {
  return (
    <div className="comment my-5 px-4 border border-(--border) py-3 rounded-2xl text-sm sm:text-[16px] flex gap-4 justify-start items-center">
      <button className="px-3 py-3 bg-(--bg-elevated) rounded-xl hover:bg-accent transition-colors duration-200 cursor-pointer">
        Comment
      </button>

      <button className="px-3 py-3 bg-(--bg-elevated) rounded-xl hover:bg-accent transition-colors duration-200 cursor-pointer">
        Description
      </button>
      <button className="px-3 py-3 bg-(--bg-elevated) rounded-xl hover:bg-accent transition-colors duration-200 cursor-pointer flex items-center gap-2">
        Ask <RiRobot3Fill />
      </button>
    </div>
  );
}

export default VideoTabs