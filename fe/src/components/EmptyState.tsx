import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-lg mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No content yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Start building your second brain by adding your first piece of content
      </p>
      <Button onClick={onAddClick}>
        Add Your First Item
      </Button>
    </div>
  );
};

export default EmptyState;