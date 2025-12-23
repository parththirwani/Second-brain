import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { Document } from '../../lib/types';
import ContentForm from '../Content/ContentForm';

interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onSave: (data: any) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  open,
  onOpenChange,
  document,
  onSave,
}) => {
  const handleSave = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Edit Content' : 'Add New Content'}
          </DialogTitle>
        </DialogHeader>
        <ContentForm
          document={document}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContentModal;