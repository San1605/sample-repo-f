import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const authAPI = {
    getYouTubeAuthUrl: () => api.get('/auth/youtube'),
    handleCallback: (code) => api.post('/auth/callback', { code })
};

// Video API
export const videoAPI = {
    getVideo: (videoId) => api.get(`/video/${videoId}`),
    updateVideo: (videoId, data, accessToken) =>
        api.put(`/video/${videoId}`, { ...data, accessToken })
};

// Comments API
export const commentsAPI = {
    getComments: (videoId) => api.get(`/comments/${videoId}`),
    addComment: (videoId, data, accessToken) =>
        api.post(`/comments/${videoId}`, { ...data, accessToken }),
    deleteComment: (commentId, accessToken) =>
        api.delete(`/comments/${commentId}`, { data: { accessToken } })
};

// Notes API
export const notesAPI = {
    getNotes: (params = {}) => api.get('/notes', { params }),
    createNote: (data) => api.post('/notes', data),
    updateNote: (id, data) => api.put(`/notes/${id}`, data),
    deleteNote: (id) => api.delete(`/notes/${id}`)
};

// Events API
export const eventsAPI = {
    getEvents: (params = {}) => api.get('/events', { params })
};

export default api;