import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import WhiteboardPage from './pages/WhiteboardPage';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-blue-600">CollabTool</span>
                  </div>
                  <div className="ml-6 flex space-x-8">
                    <Link to="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/document/:id" element={<DocumentPage />} />
            <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;