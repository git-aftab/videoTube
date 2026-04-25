import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ThumbsUp, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const Watch = () => {
  const { videoId } = useParams();
  const { currentUser } = useAuth();
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Could add states for isSubscribed, isLiked, but for now we'll fetch and show basic info
  // The API endpoints for likes and subscriptions exist, but let's implement the UI basic first

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const [videoRes, commentsRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get(`/comment/${videoId}`)
        ]);
        
        if (videoRes.data?.success) {
          setVideo(videoRes.data.data);
        }
        if (commentsRes.data?.success) {
          // comments api uses aggregatePaginate, returns items in .comments array within the facet or similar structure depending on controller
          // Based on comment.controller.js, it returns an array with facets: { comments: [], totalCount: x } or similar.
          // Wait, the controller returns the aggregated comments which might be an array of objects directly if it wasn't paginated, but it used $facet.
          const data = commentsRes.data.data[0]; 
          setComments(data?.comments || []);
        }
      } catch (error) {
        toast.error('Failed to load video details');
      } finally {
        setLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await api.post(`/comment/${videoId}`, { content: newComment });
      if (res.data?.success) {
        setNewComment('');
        // Fetch comments again or prepend
        const newC = res.data.data.comment;
        // Since we don't get fully populated owner back from create, best to just reload comments
        const commentsRes = await api.get(`/comment/${videoId}`);
        setComments(commentsRes.data.data[0]?.comments || []);
        toast.success('Comment added!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const toggleLike = async () => {
    if (!currentUser) return toast.error('Please login to like');
    try {
      await api.post(`/like/${videoId}`);
      toast.success('Like updated');
      // In a real app we'd fetch the like status and count, but the backend toggleVideoLike just returns the like doc or deletes it.
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const toggleSubscribe = async () => {
    if (!currentUser) return toast.error('Please login to subscribe');
    try {
      await api.post(`/subscribe/${video?.ownerDetails?._id}`);
      toast.success('Subscription updated');
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!video) {
    return <div className="text-white text-center mt-20">Video not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      <div className="lg:col-span-2 space-y-4">
        {/* Video Player */}
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-[var(--color-border-dark)]">
          <video 
            src={video.videoFile} 
            poster={video.thumbnail} 
            controls 
            autoPlay 
            className="w-full h-full"
          ></video>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.ownerDetails?._id}`} className="flex items-center gap-3 group">
                <img 
                  src={video.ownerDetails?.avatar} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-purple-500 transition-all" 
                />
                <div>
                  <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">{video.ownerDetails?.fullName || video.ownerDetails?.username}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {/* Could show subscribers here if backend provided it in video fetch */}
                    @{video.ownerDetails?.username}
                  </p>
                </div>
              </Link>
              <button 
                onClick={toggleSubscribe}
                className="ml-2 bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleLike} className="flex items-center gap-2 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border-dark)] px-4 py-2 rounded-full text-white transition-colors">
                <ThumbsUp className="w-5 h-5" /> 
                <span className="text-sm font-medium">Like</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl p-4 mt-4">
            <div className="flex gap-2 text-sm font-medium text-white mb-2">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-line">{video.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-6">
          <h3 className="text-xl font-bold text-white mb-6">{comments.length} Comments</h3>
          
          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
              <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..." 
                  className="w-full bg-transparent border-b border-[var(--color-border-dark)] focus:border-purple-500 py-1 text-white outline-none transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit" 
                    disabled={!newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <Link to={`/channel/${comment.owner?._id}`}>
                  <img src={comment.owner?.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/channel/${comment.owner?._id}`} className="text-sm font-medium text-white hover:text-purple-400">
                      @{comment.owner?.username}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Videos Sidebar (Empty for now) */}
      <div className="hidden lg:block space-y-4">
        <h3 className="text-lg font-medium text-white mb-4">Up next</h3>
        <div className="p-4 bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl text-center text-gray-400 text-sm">
          Suggested videos will appear here.
        </div>
      </div>
    </div>
  );
};

export default Watch;
