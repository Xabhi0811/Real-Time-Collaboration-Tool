import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentEditor from '../components/DocumentEditor';

const DocumentPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/documents/${id}`);
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading document...</div>;
  if (!document) return <div className="text-center py-10">Document not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">{document.title}</h1>
      <div className="bg-white shadow rounded-lg p-6 h-[500px]">
        <DocumentEditor documentId={id} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentPage;