# YouTube Dashboard

A comprehensive dashboard for managing YouTube videos with features for video management, comments, and personal notes.

## Features

- 🎥 **Video Management**: View and edit video details (title, description)
- 💬 **Comment System**: View, add, reply to, and delete comments
- 📝 **Notes System**: Create, edit, search, and tag personal notes
- 🔍 **Search & Filter**: Find notes by content or tags
- 📊 **Event Logging**: Track all user actions and API calls
- 🔐 **YouTube OAuth**: Secure authentication with YouTube API

## Tech Stack

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: Google OAuth 2.0
- **API Integration**: YouTube Data API v3

### Frontend
- **Framework**: React (Create React App)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify

## API Endpoints

### Authentication
- `GET /api/auth/youtube` - Get YouTube OAuth URL
- `POST /api/auth/callback` - Handle OAuth callback

### Video Management
- `GET /api/video/:videoId` - Get video details
- `PUT /api/video/:videoId` - Update video title/description

### Comments
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments/:videoId` - Add comment or reply
- `DELETE /api/comments/:commentId` - Delete comment

### Notes
- `GET /api/notes` - Get notes (with search/filter)
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Event Logs
- `GET /api/events` - Get event logs (with pagination/filter)

## Database Schema

### EventLog Collection
```javascript
{
  _id: ObjectId,
  action: String,        // Action type (e.g., 'video_fetch', 'comment_create')
  details: Mixed,        // Additional event data
  videoId: String,       // Related video ID (optional)
  timestamp: Date        // When the event occurred
}
```

### Note Collection
```javascript
{
  _id: ObjectId,
  title: String,         // Note title
  content: String,       // Note content
  tags: [String],        // Array of tags
  videoId: String,       // Related video ID (optional)
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Cloud Console account

### Backend Setup

1. **Clone and setup backend:**
```bash
cd backend
npm install
```

2. **Environment Configuration:**
Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
YOUTUBE_CLIENT_ID=your_google_client_id
YOUTUBE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_REDIRECT_URI=http://localhost:3000/callback
```

3. **Google Cloud Setup:**
- Create project in Google Cloud Console
- Enable YouTube Data API v3
- Create OAuth 2.0 credentials
- Add `http://localhost:5173/callback` to authorized redirect URIs

4. **Start backend:**
```bash
npm run dev
```

### Frontend Setup

1. **Setup frontend:**
```bash
cd frontend
npm install
```

2. **Environment Configuration:**
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start frontend:**
```bash
npm start
```

### Video Setup

1. **Upload an unlisted video to YouTube**
2. **Get the video ID from the URL**
3. **Replace 'YOUR_VIDEO_ID' in `frontend/src/components/Dashboard.js`**

## Deployment

### Backend (Render/Heroku)
1. Connect repository to deployment platform
2. Set environment variables
3. Deploy backend service

### Frontend (Vercel/Netlify)
1. Connect repository to deployment platform
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Update API URL in environment variables

### MongoDB Atlas
1. Create cluster
2. Add IP whitelist (0.0.0.0/0 for production)
3. Create database user
4. Get connection string

## Usage

1. **Connect YouTube Account**: Click "Connect YouTube Account" to authenticate
2. **View Video Details**: See stats, title, description of your uploaded video
3. **Manage Comments**: View, add, reply to, and delete comments
4. **Create Notes**: Add personal notes with tags for video improvements
5. **Search Notes**: Use search and tag filters to find specific notes
6. **View Logs**: Check event logs to see all actions performed

## Event Logging

All user actions are automatically logged:
- Video fetches and updates
- Comment operations (create, delete)
- Note operations (create, update, delete)
- Authentication events
- Error events

## Security

- YouTube OAuth 2.0 for secure API access
- Environment variables for sensitive data
- Input validation and error handling
- Rate limiting considerations for YouTube API

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License