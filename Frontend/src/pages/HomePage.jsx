import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use environment variable
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        
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
  }, []);

  const createNewDocument = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Document' })
      });
      const newDoc = await response.json();
      setDocuments([...documents, newDoc]);
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const createNewWhiteboard = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/whiteboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Whiteboard' })
      });
      const newWB = await response.json();
      setWhiteboards([...whiteboards, newWB]);
    } catch (err) {
      console.error('Error creating whiteboard:', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Workspace</h1>
        <div className="flex space-x-4">
          <button onClick={createNewDocument} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            New Document
          </button>
          <button onClick={createNewWhiteboard} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            New Whiteboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {documents.map(doc => (
                  <li key={doc._id}>
                    <Link to={`/document/${doc._id}`} className="block px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <p className="font-medium text-blue-600">{doc.title}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">No documents found</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Whiteboards</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {whiteboards.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {whiteboards.map(wb => (
                  <li key={wb._id}>
                    <Link to={`/whiteboard/${wb._id}`} className="block px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <p className="font-medium text-green-600">{wb.title}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(wb.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">No whiteboards found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;