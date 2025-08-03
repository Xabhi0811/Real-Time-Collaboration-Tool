import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use Vite's environment variables
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
      setDocuments([...documents, newDoc]);
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
      setWhiteboards([...whiteboards, newWB]);
    } catch (err) {
      console.error('Error creating whiteboard:', err);
    }
  };

  // ... rest of your component ...
};

export default HomePage;