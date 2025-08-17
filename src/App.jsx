import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import EventLogs from './components/EventLogs';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6 fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route path="/events" element={<EventLogs />} />
            </Routes>
          </main>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;