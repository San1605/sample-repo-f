import React, { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VideoDetails = ({ videoId }) => {
    const { accessToken } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchVideo();
    }, [videoId]);

    const fetchVideo = async () => {
        try {
            setLoading(true);
            const response = await videoAPI.getVideo(videoId);

            if (response.data.success && response.data.data) {
                setVideo(response.data.data);
                setEditData({
                    title: response.data.data.snippet.title,
                    description: response.data.data.snippet.description
                });
            } else {
                toast.error('Video not found');
            }
        } catch (error) {
            console.error('Error fetching video:', error);
            toast.error('Failed to fetch video details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            const response = await videoAPI.updateVideo(videoId, editData, accessToken);

            if (response.data.success) {
                toast.success('Video updated successfully');
                setEditing(false);
                fetchVideo();
            } else {
                toast.error('Failed to update video');
            }
        } catch (error) {
            console.error('Error updating video:', error);
            toast.error('Failed to update video');
        } finally {
            setUpdating(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num?.toLocaleString() || '0';
    };

    if (loading) {
        return (
            <div className="card fade-in">
                <div className="card-header">
                    <div className="flex items-center justify-between">
                        <div className="skeleton h-5 w-32"></div>
                        <div className="skeleton h-8 w-16"></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-2/3"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton h-16"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="card text-center" style={{ padding: '2rem' }}>
                <div 
                    className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                    <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                </div>
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Video Not Found</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Please check the video ID and try again.</p>
            </div>
        );
    }

    return (
        <div className="card fade-in">
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Video Details</h3>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn btn-secondary px-3 py-1"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {editing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="input"
                            placeholder="Enter video title..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={6}
                            className="input resize-none"
                            placeholder="Enter video description..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="btn btn-success px-3 py-1 flex items-center gap-2"
                        >
                            {updating ? (
                                <>
                                    <div className="spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                    Updating...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setEditData({
                                    title: video.snippet.title,
                                    description: video.snippet.description
                                });
                            }}
                            disabled={updating}
                            className="btn btn-secondary px-3 py-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            {video.snippet.title}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {video.snippet.description || 'No description available'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Views</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {formatNumber(Number(video.statistics.viewCount))}
                            </p>
                        </div>
                        
                        <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Likes</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {formatNumber(Number(video.statistics.likeCount))}
                            </p>
                        </div>
                        
                        <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Comments</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {formatNumber(Number(video.statistics.commentCount))}
                            </p>
                        </div>
                        
                        <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Published</p>
                            <p className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                                {new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoDetails;