import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { Document } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface DocumentFormProps {
  document?: Document | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ 
  document, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    type: document?.type || 'Link',
    link: document?.link || '',
    title: document?.title || '',
    description: document?.description || '',
    tags: document?.tags?.join(', ') || '',
  });

  const handleSubmit = () => {
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Link">Link</option>
          <option value="Document">Document</option>
          <option value="Tweet">Tweet</option>
          <option value="Youtube">Youtube</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          minLength={3}
          maxLength={64}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={300}
          className="min-h-25"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="javascript, react, tutorial"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} className="flex-1">
          <Save size={18} />
          {document ? 'Update' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
