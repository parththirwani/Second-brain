import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-20">
      <div className="inline-block p-4 bg-gray-800 rounded-2xl mb-4">
        <FileText size={48} className="text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
      <p className="text-gray-400 mb-6">
        Start building your second brain by adding your first item
      </p>
      <Button onClick={onAddClick}>
        <Plus size={20} />
        Add Your First Item
      </Button>
    </div>
  );
};