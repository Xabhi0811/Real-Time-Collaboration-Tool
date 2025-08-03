import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: '' });
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docsRes = await fetch(`${backendUrl}/api/documents`);
        const docsData = await docsRes.json();
        setDocuments(docsData);
        
        const wbRes = await fetch(`${backendUrl}/api/whiteboards`);
        const wbData = await wbRes.json();
        setWhiteboards(wbData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  const createNewDocument = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Document' })
      });
      const newDoc = await response.json();
      navigate(`/document/${newDoc._id}`);
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const createNewWhiteboard = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/whiteboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Whiteboard' })
      });
      const newWB = await response.json();
      navigate(`/whiteboard/${newWB._id}`);
    } catch (err) {
      console.error('Error creating whiteboard:', err);
    }
  };

  const handleDeleteClick = (type, id) => {
    setItemToDelete({ type, id });
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const endpoint = itemToDelete.type === 'document' 
        ? `${backendUrl}/api/documents/${itemToDelete.id}`
        : `${backendUrl}/api/whiteboards/${itemToDelete.id}`;
      
      await fetch(endpoint, { method: 'DELETE' });
      
      if (itemToDelete.type === 'document') {
        setDocuments(documents.filter(doc => doc._id !== itemToDelete.id));
      } else {
        setWhiteboards(whiteboards.filter(wb => wb._id !== itemToDelete.id));
      }
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
    } finally {
      setShowConfirm(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              CollabCanvas
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Real-time collaboration for teams. Edit documents and whiteboards together instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Creation Buttons */}
        <div className="flex justify-center space-x-6 mb-12">
          <button 
            onClick={createNewDocument}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            New Document
          </button>
          <button 
            onClick={createNewWhiteboard}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            New Whiteboard
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg bg-white shadow-sm p-1">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-2 rounded-md font-medium ${activeTab === 'documents' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('whiteboards')}
              className={`px-6 py-2 rounded-md font-medium ${activeTab === 'whiteboards' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Whiteboards
            </button>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'documents' ? (
            documents.length > 0 ? (
              documents.map(doc => (
                <div key={doc._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <Link to={`/document/${doc._id}`} className="block flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h3>
                        <p className="text-gray-500 text-sm">
                          Last updated: {new Date(doc.updatedAt).toLocaleString()}
                        </p>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteClick('document', doc._id);
                        }}
                        className="text-red-400 hover:text-red-600 ml-2"
                        title="Delete document"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/document/${doc._id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Open Document
                        <svg className="ml-2 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No documents</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new document.</p>
                <div className="mt-6">
                  <button
                    onClick={createNewDocument}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Document
                  </button>
                </div>
              </div>
            )
          ) : (
            whiteboards.length > 0 ? (
              whiteboards.map(wb => (
                <div key={wb._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <Link to={`/whiteboard/${wb._id}`} className="block flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{wb.title}</h3>
                        <p className="text-gray-500 text-sm">
                          Last updated: {new Date(wb.updatedAt).toLocaleString()}
                        </p>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteClick('whiteboard', wb._id);
                        }}
                        className="text-red-400 hover:text-red-600 ml-2"
                        title="Delete whiteboard"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/whiteboard/${wb._id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        Open Whiteboard
                        <svg className="ml-2 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No whiteboards</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new whiteboard.</p>
                <div className="mt-6">
                  <button
                    onClick={createNewWhiteboard}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Whiteboard
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <p className="mb-4">
              Are you sure you want to delete this {itemToDelete.type}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;