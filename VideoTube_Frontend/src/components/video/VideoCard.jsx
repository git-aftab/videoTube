import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns'; // We need to install date-fns

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoCard = ({ video }) => {
  const { _id, thumbnail, title, views, createdAt, ownerDetails, duration } = video;

  return (
    <div className="flex flex-col gap-3 group cursor-pointer animate-fade-in">
      <Link to={`/watch/${_id}`} className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-surface-dark)] border border-transparent group-hover:border-[var(--color-border-dark)] transition-colors">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
          {formatDuration(duration)}
        </div>
      </Link>

      <div className="flex gap-3">
        <Link to={`/channel/${ownerDetails?._id}`} className="flex-shrink-0 mt-1">
          {ownerDetails?.avatar ? (
            <img 
              src={ownerDetails.avatar} 
              alt={ownerDetails.username} 
              className="w-9 h-9 rounded-full object-cover border border-transparent hover:border-purple-500 transition-colors"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm">
              {ownerDetails?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </Link>
        <div className="flex flex-col overflow-hidden">
          <Link to={`/watch/${_id}`} className="text-white font-medium text-sm line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
            {title}
          </Link>
          <Link to={`/channel/${ownerDetails?._id}`} className="text-[var(--color-text-secondary)] text-sm mt-1 hover:text-white transition-colors truncate">
            {ownerDetails?.username}
          </Link>
          <div className="flex items-center text-[var(--color-text-secondary)] text-xs mt-0.5 gap-1.5">
            <span>{views} views</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
