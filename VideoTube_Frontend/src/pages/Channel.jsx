import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import VideoCard from '../components/video/VideoCard';
import { Loader2, Settings, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Channel = () => {
  const { channelId } = useParams();
  const { currentUser } = useAuth();
  const isOwner = currentUser?._id === channelId;
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelInfo, setChannelInfo] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      setLoading(true);
      try {
        // Fetch videos for this user
        const res = await api.get('/videos', { params: { userId: channelId, limit: 50 } });
        if (res.data?.success) {
          const fetchedVideos = res.data.data.docs;
          setVideos(fetchedVideos);
          
          if (fetchedVideos.length > 0) {
            setChannelInfo(fetchedVideos[0].ownerDetails);
          } else if (isOwner) {
            // If it's the owner and no videos, use currentUser
            setChannelInfo(currentUser);
          }
        }
      } catch (err) {
        toast.error('Failed to load channel');
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannelData();
    }
  }, [channelId, isOwner, currentUser]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Use channelInfo, fallback to currentUser if owner, else generic
  const info = channelInfo || (isOwner ? currentUser : { username: 'Unknown', fullName: 'User' });

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Cover Image Placeholder */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl overflow-hidden relative border border-[var(--color-border-dark)]">
        {info.coverImage ? (
          <img src={info.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-black/20 pattern-grid"></div>
        )}
      </div>

      {/* Channel Info */}
      <div className="px-4 sm:px-8 -mt-12 sm:-mt-16 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[var(--color-background-dark)] bg-[var(--color-surface-dark)] flex-shrink-0 relative">
          {info.avatar ? (
            <img src={info.avatar} alt={info.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl">
              {info.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{info.fullName || info.username}</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">@{info.username}</p>
        </div>

        <div className="flex gap-3 mb-2">
          {isOwner ? (
            <>
              <Link 
                to="/upload"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Upload Video
              </Link>
            </>
          ) : (
            <button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-lg">
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border-dark)] mt-8 px-4">
        <button className="px-6 py-3 text-sm font-medium text-purple-400 border-b-2 border-purple-500">
          Videos
        </button>
        <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Playlists
        </button>
        <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Community
        </button>
      </div>

      {/* Video Grid */}
      <div className="mt-8 px-4">
        {videos.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface-dark)]/50 rounded-2xl border border-[var(--color-border-dark)] border-dashed">
            <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
            {isOwner && <p className="text-[var(--color-text-secondary)]">Upload a video to get started.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
