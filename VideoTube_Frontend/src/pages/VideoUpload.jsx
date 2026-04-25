import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Upload, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoUpload = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoRef = useRef(null);
  const thumbnailRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !videoFile) {
      return toast.error('Title and Video file are required');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('videoFile', videoFile);
      if (thumbnail) data.append('thumbnail', thumbnail);

      const res = await api.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data?.success) {
        toast.success('Video uploaded successfully!');
        navigate(`/channel/${currentUser._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-6">Upload Video</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left Col - Media */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video File */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Video File *</label>
                <div 
                  onClick={() => videoRef.current?.click()}
                  className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${videoFile ? 'border-purple-500 bg-purple-500/5' : 'border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] hover:border-purple-400/50 hover:bg-[var(--color-surface-hover)]'} flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group`}
                >
                  {videoPreview ? (
                    <video src={videoPreview} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">Select a video file</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 100MB</p>
                    </>
                  )}
                  <input type="file" ref={videoRef} onChange={handleVideoChange} accept="video/*" className="hidden" />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
                <div 
                  onClick={() => thumbnailRef.current?.click()}
                  className={`relative w-full aspect-video rounded-2xl border-2 border-dashed ${thumbnail ? 'border-purple-500' : 'border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] hover:border-purple-400/50 hover:bg-[var(--color-surface-hover)]'} flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group`}
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} className="w-full h-full object-cover" alt="thumbnail" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-purple-400 transition-colors" />
                      <p className="text-sm text-gray-400">Upload thumbnail</p>
                    </>
                  )}
                  <input type="file" ref={thumbnailRef} onChange={handleThumbnailChange} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>

            {/* Right Col - Details */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Title (required)</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Add a title that describes your video"
                  className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2 h-full">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell viewers about your video"
                  rows={8}
                  className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-[var(--color-surface-dark)] rounded-full h-2 mb-4 overflow-hidden border border-[var(--color-border-dark)]">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-[var(--color-border-dark)]/50">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !formData.title || !videoFile}
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium flex items-center gap-2 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Publish Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
