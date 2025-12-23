import React from 'react';
import { FileText, Youtube, Twitter, LinkIcon, Edit2, Trash2, Share2, Eye, ExternalLink } from 'lucide-react';
import type { Document } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface DocumentCardProps {
  document: Document;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onShare: (doc: Document) => void;
  onUnshare: (doc: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onDelete,
  onShare,
  onUnshare,
}) => {
  const icons = {
    Document: FileText,
    Tweet: Twitter,
    Youtube: Youtube,
    Link: LinkIcon,
  };

  const Icon = icons[document.type];

  return (
    <Card className="p-5 hover:border-gray-600 transition-all group hover:shadow-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-700 rounded-lg">
            <Icon size={20} className="text-blue-400" />
          </div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {document.type}
          </span>
        </div>
        <div className="flex gap-1">
          {document.sharable ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUnshare(document)}
              className="h-8 w-8 text-green-400 hover:text-green-300"
              title="Unshare"
            >
              <Eye size={16} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(document)}
              className="h-8 w-8"
              title="Share"
            >
              <Share2 size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(document)}
            className="h-8 w-8"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(document._id)}
            className="h-8 w-8 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {document.title}
      </h3>
      
      {document.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {document.description}
        </p>
      )}

      <a
        href={document.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-3 truncate"
      >
        <ExternalLink size={14} />
        <span className="truncate">{document.link}</span>
      </a>

      {document.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};
