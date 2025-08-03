import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Whiteboard from '../components/Whiteboard';

const WhiteboardPage = () => {
  const { id } = useParams();
  const [whiteboard, setWhiteboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhiteboard = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/whiteboards/${id}`);
        const data = await response.json();
        setWhiteboard(data);
      } catch (err) {
        console.error('Error fetching whiteboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhiteboard();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading whiteboard...</div>;
  if (!whiteboard) return <div className="text-center py-10">Whiteboard not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">{whiteboard.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <Whiteboard whiteboardId={id} initialElements={whiteboard.elements} />
      </div>
    </div>
  );
};

export default WhiteboardPage;