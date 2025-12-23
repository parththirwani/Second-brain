import React from 'react';
import { FileText, Youtube, Twitter, Link as LinkIcon, Edit2, Trash2, Share2, Eye, ExternalLink } from 'lucide-react';
import type { Document } from '../../lib/types';
import { Button } from '../ui/button';

interface ContentCardProps {
  document: Document;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  onShare: (doc: Document) => void;
  onUnshare: (doc: Document) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
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
    <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {document.type}
          </span>
        </div>
        <div className="flex gap-1">
          {document.sharable ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onUnshare(document)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Unshare"
            >
              <Eye className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onShare(document)}
              className="hover:bg-muted"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(document)}
            className="hover:bg-muted"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(document)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h3 className="text-base font-semibold mb-2 line-clamp-2">
        {document.title}
      </h3>
      
      {document.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {document.description}
        </p>
      )}

      <a
        href={document.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline flex items-center gap-1 mb-3 truncate"
      >
        <ExternalLink className="h-3 w-3 shrink-0" />
        <span className="truncate">{document.link}</span>
      </a>

      {document.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCard;