import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CommentsSection = ({ videoId }) => {
    const { accessToken } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReply, setActiveReply] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await commentsAPI.getComments(videoId);
            
            if (response.data.success) {
                setComments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const response = await commentsAPI.addComment(videoId, { text: newComment }, accessToken);
            
            if (response.data.success) {
                toast.success('Comment added successfully');
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId) => {
        if (!replyText.trim()) return;

        try {
            setSubmitting(true);
            const response = await commentsAPI.addComment(videoId, { 
                text: replyText, 
                parentId 
            }, accessToken);
            
            if (response.data.success) {
                toast.success('Reply added successfully');
                setReplyText('');
                setActiveReply(null);
                fetchComments();
            }
        } catch (error) {
            console.error('Error adding reply:', error);
            toast.error('Failed to add reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await commentsAPI.deleteComment(commentId, accessToken);
            
            if (response.data.success) {
                toast.success('Comment deleted successfully');
                fetchComments();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num?.toString() || '0';
    };

    if (loading) {
        return (
            <div className="card fade-in">
                <div className="card-header">
                    <div className="skeleton h-5 w-24"></div>
                </div>
                <div className="space-y-4">
                    <div className="skeleton h-16"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3">
                            <div className="skeleton w-8 h-8 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="skeleton h-4 w-1/3"></div>
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-3 w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card fade-in">
            <div className="card-header">
                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Add new comment */}
            <div className="card mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="input resize-none mb-3"
                />
                <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {newComment.length}/500 characters
                    </span>
                    <button
                        onClick={handleAddComment}
                        disabled={submitting || !newComment.trim() || newComment.length > 500}
                        className="btn btn-primary px-3 py-1 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                Posting...
                            </>
                        ) : (
                            'Post Comment'
                        )}
                    </button>
                </div>
            </div>

            {/* Comments list */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div 
                            className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                            <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No Comments Yet</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Be the first to leave a comment!</p>
                </div>
            ) : (
                comments.map((commentThread) => {
                    const topComment = commentThread.snippet.topLevelComment;
                    const replies = commentThread.replies?.comments || [];

                    return (
                        <div key={commentThread.id} className="space-y-3">
                            {/* Top level comment */}
                            <div className="group">
                                <div className="flex gap-3">
                                    <img
                                        src={topComment.snippet.authorProfileImageUrl}
                                        alt={topComment.snippet.authorDisplayName}
                                        className="w-8 h-8 rounded-full"
                                        style={{ border: '1px solid var(--border-color)' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                                {topComment.snippet.authorDisplayName}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {formatDate(topComment.snippet.publishedAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                                            {topComment.snippet.textDisplay}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                👍 {formatNumber(topComment.snippet.likeCount || 0)}
                                            </span>
                                            <button
                                                onClick={() => setActiveReply(activeReply === topComment.id ? null : topComment.id)}
                                                className="font-medium transition-colors"
                                                style={{ color: 'var(--accent-primary)' }}
                                            >
                                                Reply
                                            </button>
                                            {topComment.snippet.canRate && (
                                                <button
                                                    onClick={() => handleDeleteComment(topComment.id)}
                                                    className="transition-colors opacity-0 group-hover:opacity-100"
                                                    style={{ color: 'var(--error)' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        {/* Reply form */}
                                        {activeReply === topComment.id && (
                                            <div className="mt-3 card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Add a reply..."
                                                    rows={2}
                                                    className="input resize-none mb-2"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleReply(topComment.id)}
                                                        disabled={submitting || !replyText.trim()}
                                                        className="btn btn-primary px-3 py-1 text-xs flex items-center gap-1"
                                                    >
                                                        {submitting ? (
                                                            <>
                                                                <div className="spin rounded-full h-2 w-2 border border-white border-t-transparent"></div>
                                                                Replying...
                                                            </>
                                                        ) : (
                                                            'Reply'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActiveReply(null);
                                                            setReplyText('');
                                                        }}
                                                        className="btn btn-secondary px-3 py-1 text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Replies */}
                                {replies.length > 0 && (
                                    <div className="ml-10 mt-3 space-y-2" style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '0.75rem' }}>
                                        {replies.map((reply) => (
                                            <div key={reply.id} className="group">
                                                <div className="flex gap-2">
                                                    <img
                                                        src={reply.snippet.authorProfileImageUrl}
                                                        alt={reply.snippet.authorDisplayName}
                                                        className="w-6 h-6 rounded-full"
                                                        style={{ border: '1px solid var(--border-color)' }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                                                                {reply.snippet.authorDisplayName}
                                                            </span>
                                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                                {formatDate(reply.snippet.publishedAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>
                                                            {reply.snippet.textDisplay}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span style={{ color: 'var(--text-muted)' }}>
                                                                👍 {formatNumber(reply.snippet.likeCount || 0)}
                                                            </span>
                                                            {reply.snippet.canRate && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(reply.id)}
                                                                    className="transition-colors opacity-0 group-hover:opacity-100"
                                                                    style={{ color: 'var(--error)' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            </div>
        </div>
    );
};

export default CommentsSection;