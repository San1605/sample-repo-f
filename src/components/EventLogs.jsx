import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';

const EventLogs = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        videoId: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventsAPI.getEvents(filters);
            
            if (response.data.success) {
                setEvents(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch event logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionIcon = (action) => {
        const iconMap = {
            'video_fetch': '📹',
            'video_update': '✏️',
            'comments_fetch': '💬',
            'comment_create': '✍️',
            'comment_delete': '🗑️',
            'note_create': '📝',
            'note_update': '📝',
            'note_delete': '🗑️',
            'auth_request': '🔐',
            'auth_success': '✅',
            'auth_error': '❌'
        };
        return iconMap[action] || '📋';
    };

    const getActionColor = (action) => {
        if (action.includes('error')) return 'var(--error)';
        if (action.includes('delete')) return 'var(--warning)';
        if (action.includes('create') || action.includes('success')) return 'var(--success)';
        if (action.includes('update')) return 'var(--accent-primary)';
        return 'var(--text-secondary)';
    };

    // Get unique actions for filter dropdown
    const uniqueActions = [...new Set(events.map(event => event.action))];

    return (
        <div className="fade-in">
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Event Logs</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track all system activities</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Action</label>
                        <select
                            value={filters.action}
                            onChange={(e) => handleFilterChange('action', e.target.value)}
                            className="input"
                        >
                            <option value="">All actions</option>
                            {uniqueActions.map(action => (
                                <option key={action} value={action}>
                                    {getActionIcon(action)} {action}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Video ID</label>
                        <input
                            type="text"
                            value={filters.videoId}
                            onChange={(e) => handleFilterChange('videoId', e.target.value)}
                            placeholder="Filter by video ID..."
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Per Page</label>
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                            className="input"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ action: '', videoId: '', page: 1, limit: 20 })}
                            className="btn btn-secondary w-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Events Table */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="skeleton w-8 h-8"></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="skeleton h-4 w-1/4"></div>
                                        <div className="skeleton h-3 w-1/2"></div>
                                    </div>
                                    <div className="skeleton h-3 w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12">
                        <div 
                            className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                            <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No Events Found</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No events match your current filters.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event._id} className="group card transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div 
                                            className="w-8 h-8 rounded flex items-center justify-center text-sm"
                                            style={{ 
                                                backgroundColor: 'var(--bg-card)',
                                                border: `1px solid ${getActionColor(event.action)}`
                                            }}
                                        >
                                            <span>{getActionIcon(event.action)}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span 
                                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                                    style={{ 
                                                        backgroundColor: 'var(--bg-card)',
                                                        color: getActionColor(event.action),
                                                        border: `1px solid ${getActionColor(event.action)}`
                                                    }}
                                                >
                                                    {event.action}
                                                </span>
                                                {event.videoId && (
                                                    <span className="tag">
                                                        Video: {event.videoId}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {event.details && (
                                                <details className="group/details">
                                                    <summary className="text-xs cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                        View details
                                                    </summary>
                                                    <div className="mt-2 card" style={{ backgroundColor: 'var(--bg-card)' }}>
                                                        <pre className="whitespace-pre-wrap text-xs overflow-x-auto" style={{ color: 'var(--text-secondary)' }}>
                                                            {JSON.stringify(event.details, null, 2)}
                                                        </pre>
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs flex-shrink-0 ml-4" style={{ color: 'var(--text-muted)' }}>
                                        {formatDate(event.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} events
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="btn btn-secondary px-3 py-1"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                        const page = Math.max(1, pagination.page - 2) + i;
                                        if (page > pagination.pages) return null;
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 text-xs rounded transition-colors ${
                                                    page === pagination.page
                                                        ? 'btn btn-primary'
                                                        : 'btn btn-secondary'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                    className="btn btn-secondary px-3 py-1"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default EventLogs;