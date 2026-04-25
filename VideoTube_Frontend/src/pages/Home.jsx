import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import VideoCard from '../components/video/VideoCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/videos`, {
          params: { query, page: 1, limit: 20 }
        });
        if (response.data?.success) {
          // aggregatePaginate returns items in `docs` array
          setVideos(response.data.data.docs);
        }
      } catch (err) {
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {query && (
        <div className="mb-6">
          <h2 className="text-xl text-white font-medium">Search results for "{query}"</h2>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-[var(--color-surface-dark)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-dark)]">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-xl font-medium text-white">No videos found</h3>
          <p className="text-[var(--color-text-secondary)] mt-2">Try searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
