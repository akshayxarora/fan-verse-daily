// Ghost-style editor component
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, Code, Maximize2, Minimize2 } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';

interface GhostStyleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function GhostStyleEditor({
  value,
  onChange,
  placeholder = 'Begin writing your post...',
}: GhostStyleEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (value) {
      setPreview(renderMarkdown(value));
    } else {
      setPreview('');
    }
  }, [value]);

  return (
    <div className={cn(
      "relative border border-border rounded-lg bg-background overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 rounded-none"
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8"
          >
            {isPreview ? (
              <>
                <Code className="w-4 h-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="h-8"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div
            className="prose prose-lg dark:prose-invert max-w-none p-8 overflow-auto bg-background"
            style={{ minHeight: '600px', maxHeight: isFullscreen ? 'calc(100vh - 80px)' : '600px' }}
            dangerouslySetInnerHTML={{ __html: preview || '<p class="text-muted-foreground">Nothing to preview</p>' }}
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono text-base border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-8 min-h-[600px]"
            style={{ 
              minHeight: isFullscreen ? 'calc(100vh - 80px)' : '600px',
              maxHeight: isFullscreen ? 'calc(100vh - 80px)' : '600px',
            }}
          />
        )}
      </div>

      {/* Word count */}
      <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-secondary/80 text-xs text-muted-foreground">
        {value.split(/\s+/).filter(word => word.length > 0).length} words
      </div>
    </div>
  );
}

