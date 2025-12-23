import React, { useState, useEffect } from 'react';
import useContent from '../Hooks/useContent';
import useToast from '../Hooks/useToast';
import { Button } from '../ui/button';
import EmptyState from '../EmptyState';
import ContentCard from '../Content/ContentCard';
import ContentModal from '../modals/ContentModal';
import ConfirmDialog from '../modals/ConfirmModal';
import ShareModal from '../modals/ShareModal';
import { Search, Plus } from 'lucide-react';
import type { ContentDocument } from '@/types/types';

export const HomePage: React.FC = () => {
  const [filteredDocuments, setFilteredDocuments] = useState<ContentDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ContentDocument | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<ContentDocument | null>(null);
  const [shareLink, setShareLink] = useState('');

  const {
    documents,
    loading,
    loadDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    shareDocument,
    unshareDocument,
  } = useContent();

  const { success, error: showError } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    const filtered = (documents as ContentDocument[]).filter((doc) => {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    });
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const handleSave = async (data: any) => {
    const isSuccess = editingDocument
      ? await updateDocument(editingDocument._id, data)
      : await createDocument(data);

    if (isSuccess) {
      success(editingDocument ? 'Content updated successfully' : 'Content created successfully');
      setShowContentModal(false);
      setEditingDocument(null);
    } else {
      showError('Failed to save content');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDocument) return;
    
    const isSuccess = await deleteDocument(deletingDocument._id);
    if (isSuccess) {
      success('Content deleted successfully');
    } else {
      showError('Failed to delete content');
    }
    setDeletingDocument(null);
  };

  const handleShare = async (doc: ContentDocument) => {
    const link = await shareDocument(doc._id);
    if (link) {
      setShareLink(link);
      setShowShareModal(true);
      success('Content shared successfully');
    } else {
      showError('Failed to share content');
    }
  };

  const handleUnshare = async (doc: ContentDocument) => {
    const isSuccess = await unshareDocument(doc._id);
    if (isSuccess) {
      success('Content unshared successfully');
    } else {
      showError('Failed to unshare content');
    }
  };

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-white"
            />
          </div>
          <Button onClick={() => {
            setEditingDocument(null);
            setShowContentModal(true);
          }} size="sm">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading your content...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState
            onAddClick={() => {
              setEditingDocument(null);
              setShowContentModal(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <ContentCard
                key={doc._id}
                document={doc}
                onEdit={(doc) => {
                  setEditingDocument(doc);
                  setShowContentModal(true);
                }}
                onDelete={(doc) => {
                  setDeletingDocument(doc);
                  setShowDeleteDialog(true);
                }}
                onShare={handleShare}
                onUnshare={handleUnshare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ContentModal
        open={showContentModal}
        onOpenChange={setShowContentModal}
        document={editingDocument}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Content"
        description="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        shareLink={shareLink}
      />
    </div>
  );
};

export default HomePage;