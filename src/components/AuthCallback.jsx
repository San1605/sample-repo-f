import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleAuthCallback();
    }, []);

    const handleAuthCallback = async () => {
        try {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                throw new Error('Authentication was cancelled or failed');
            }

            if (!code) {
                throw new Error('No authorization code received');
            }

            const response = await authAPI.handleCallback(code);
            
            if (response.data.success) {
                login(response.data.accessToken);
                toast.success('Successfully connected to YouTube!');
                navigate('/');
            } else {
                throw new Error('Failed to authenticate with YouTube');
            }
        } catch (error) {
            console.error('Auth callback error:', error);
            setError(error.message || 'Authentication failed');
            toast.error(error.message || 'Authentication failed');
        } finally {
            setProcessing(false);
        }
    };

    if (processing) {
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
                        Connecting to YouTube...
                    </h2>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Please wait while we complete the authentication process.
                    </p>
                    <div className="flex justify-center">
                        <div className="spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: 'var(--accent-primary)' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-20">
                <div className="card text-center" style={{ padding: '2rem' }}>
                    <div 
                        className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: 'var(--error)' }}
                    >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Authentication Failed
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary px-4 py-2"
                    >
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default AuthCallback;