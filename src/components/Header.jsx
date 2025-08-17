import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    return (
        <header style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderBottom: '1px solid var(--border-color)' 
        }}>
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-6 h-6 rounded flex items-center justify-center"
                                style={{ backgroundColor: 'var(--youtube)' }}
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                YouTube Dashboard
                            </h1>
                        </div>
                        
                        <nav className="flex gap-1">
                            <Link
                                to="/"
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    location.pathname === '/' 
                                        ? 'text-white' 
                                        : 'hover:text-white'
                                }`}
                                style={{ 
                                    backgroundColor: location.pathname === '/' ? 'var(--accent-primary)' : 'transparent',
                                    color: location.pathname === '/' ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/events"
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    location.pathname === '/events' 
                                        ? 'text-white' 
                                        : 'hover:text-white'
                                }`}
                                style={{ 
                                    backgroundColor: location.pathname === '/events' ? 'var(--accent-primary)' : 'transparent',
                                    color: location.pathname === '/events' ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                Events
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-2 py-1 rounded text-xs"
                                     style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                    <span className="status-dot status-online"></span>
                                    Connected
                                </div>
                                <button
                                    onClick={logout}
                                    className="btn btn-secondary px-3 py-1 text-xs"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-2 py-1 rounded text-xs"
                                 style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                <span className="status-dot status-offline"></span>
                                Disconnected
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;