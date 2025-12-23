import type { ContentDocument } from '@/types/types';
import { useState, useCallback } from 'react';


interface UseContentReturn {
  documents: ContentDocument[];
  loading: boolean;
  loadDocuments: () => Promise<void>;
  createDocument: (data: Partial<ContentDocument>) => Promise<boolean>;
  updateDocument: (id: string, data: Partial<ContentDocument>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  shareDocument: (id: string) => Promise<string | null>;
  unshareDocument: (id: string) => Promise<boolean>;
}

const useContent = (): UseContentReturn => {
  const [documents, setDocuments] = useState<ContentDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch('/api/documents');
      const data: ContentDocument[] = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (data: Partial<ContentDocument>): Promise<boolean> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newDoc: ContentDocument = await response.json();
        setDocuments(prev => [...prev, newDoc]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create document:', error);
      return false;
    }
  }, []);

  const updateDocument = useCallback(async (id: string, data: Partial<ContentDocument>): Promise<boolean> => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const updatedDoc: ContentDocument = await response.json();
        setDocuments(prev => prev.map(doc => doc._id === id ? updatedDoc : doc));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update document:', error);
      return false;
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }, []);

  const shareDocument = useCallback(async (id: string): Promise<string | null> => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/${id}/share`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const { shareLink, sharableId } = await response.json();
        setDocuments(prev => prev.map(doc => 
          doc._id === id ? { ...doc, sharable: true, sharableId } : doc
        ));
        return shareLink;
      }
      return null;
    } catch (error) {
      console.error('Failed to share document:', error);
      return null;
    }
  }, []);

  const unshareDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/${id}/unshare`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setDocuments(prev => prev.map(doc => 
          doc._id === id ? { ...doc, sharable: false, sharableId: undefined } : doc
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unshare document:', error);
      return false;
    }
  }, []);

  return {
    documents,
    loading,
    loadDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    shareDocument,
    unshareDocument,
  };
};

export default useContent;