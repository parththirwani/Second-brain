import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { api } from './lib/api';
import type { Document } from './lib/types';
import { AuthScreen } from './components/Auth';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { DocumentCard } from './components/DocumentCard';
import { DocumentForm } from './components/DocumentForm';
import { EmptyState } from './components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await api.content.getAll();
      setDocuments(data.documents);
      setFilteredDocuments(data.documents);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user, loadDocuments]);

  useEffect(() => {
    const filtered = documents.filter(doc => {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    });
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const handleSave = async (data: any) => {
    try {
      if (editingDocument) {
        await api.content.update(editingDocument._id, data);
      } else {
        await api.content.create(data);
      }
      await loadDocuments();
      setShowModal(false);
      setEditingDocument(null);
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.content.delete(id);
      await loadDocuments();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleShare = async (doc: Document) => {
    try {
      const data = await api.brain.share(doc._id);
      alert(`Shareable link: ${data.sharableLink}`);
      await loadDocuments();
    } catch (err: any) {
      alert('Failed to share: ' + err.message);
    }
  };

  const handleUnshare = async (doc: Document) => {
    try {
      await api.brain.unshare(doc._id);
      await loadDocuments();
    } catch (err: any) {
      alert('Failed to unshare: ' + err.message);
    }
  };

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => {
            setEditingDocument(null);
            setShowModal(true);
          }}
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState
            onAddClick={() => {
              setEditingDocument(null);
              setShowModal(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onEdit={(doc) => {
                  setEditingDocument(doc);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                onShare={handleShare}
                onUnshare={handleUnshare}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-800">
            <DialogTitle>
              {editingDocument ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <DocumentForm
              document={editingDocument}
              onSave={handleSave}
              onCancel={() => {
                setShowModal(false);
                setEditingDocument(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;