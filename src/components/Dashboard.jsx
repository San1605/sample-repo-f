import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthButton from './AuthButton';
import VideoDetails from './VideoDetails';
import CommentsSection from './CommentsSection';
import NotesSection from './NotesSection';

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    const [videoId, setVideoId] = useState('8FPktSuxaIo'); // Replace with actual video ID

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-20">
                <div className="card text-center" style={{ padding: '2rem' }}>
                    <div 
                        className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: 'var(--youtube)' }}
                    >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Welcome to YouTube Dashboard
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Connect your YouTube account to manage your videos, comments, and personal notes all in one place.
                    </p>
                    <AuthButton />
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                            Video Dashboard
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Manage your YouTube content and notes
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={videoId}
                            onChange={(e) => setVideoId(e.target.value)}
                            placeholder="Enter video ID..."
                            className="input w-48"
                        />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Video ID
                        </span>
                    </div>
                </div>
                
                {videoId === '8FPktSuxaIo' && (
                    <div className="card mb-6" style={{ 
                        backgroundColor: 'var(--bg-tertiary)', 
                        borderColor: 'var(--warning)',
                        borderLeftWidth: '3px'
                    }}>
                        <div className="flex items-start gap-3">
                            <svg className="w-4 h-4 mt-0.5" style={{ color: 'var(--warning)' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                    Setup Required
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    Replace the default video ID above with your actual YouTube video ID to start managing your content.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Details and Comments */}
                <div className="lg:col-span-2 space-y-6">
                    <VideoDetails videoId={videoId} />
                    <CommentsSection videoId={videoId} />
                </div>

                {/* Notes Section */}
                <div className="lg:col-span-1">
                    <NotesSection videoId={videoId} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;