import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthButton = () => {
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getYouTubeAuthUrl();

            if (response.data.success) {
                // Redirect to YouTube OAuth
                window.location.href = response.data.authUrl;
            } else {
                // If auth URL generation fails, show error immediately
                toast.error('Failed to generate authentication URL');
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error('Auth error:', error);
            // Show error for network/API issues, but not OAuth flow errors
            toast.error('Unable to connect to authentication service');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAuth}
            disabled={loading}
            className="btn btn-youtube px-6 py-2 flex items-center gap-2 mx-auto"
        >
            {loading ? (
                <>
                    <div className="spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Connecting...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Connect YouTube Account</span>
                </>
            )}
        </button>
    );
};

export default AuthButton;