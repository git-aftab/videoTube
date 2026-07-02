import { motion } from "framer-motion";
import img from "../../assets/website_profile_img01.png";
import type { Video } from "../../types";

interface VideoCardsProps {
  video: Video;
}

const videoCards = ({ video }: VideoCardsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full border border-border hover:border-accent rounded-2xl aspect-video shadow-lg hover:shadow-accent/50 transition-colors duration-200 ease-in"
    >
      <div className="img w-full h-[80%] px-0.5 py-0.5 ">
        <img
          src={video.thumbnail || img}
          alt="thumbnail"
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>
      <div className="dets border-t border-(--accent-soft) h-[20%]">
        <p className="text-(--text-primary) font-semibold px-3">
          {/* Title  */}
          {video.title.trim()}
        </p>
        <p className="flex justify-between items-center text-(--text-muted) px-3 text-sm">
          {/* Channel Name */}
          {/* <span>{video.owner.fullName}</span> */}
          <span className="text-(--text-muted)">
            {/* views */}
            {video.views.toLocaleString()}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default videoCards;
