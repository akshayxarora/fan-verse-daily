// Markdown editor component for admin panel
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { renderMarkdown } from '@/lib/markdown';
import { Eye, Code, FileText } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing in Markdown...',
  height = '600px',
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (value) {
      setPreview(renderMarkdown(value));
    } else {
      setPreview('');
    }
  }, [value]);

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="edit" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Edit
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="split" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Split
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm"
          style={{ minHeight: height }}
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <div
          className="prose prose-lg dark:prose-invert max-w-none border rounded-lg p-6 overflow-auto bg-card"
          style={{ minHeight: height }}
          dangerouslySetInnerHTML={{ __html: preview || '<p class="text-muted-foreground">Nothing to preview</p>' }}
        />
      </TabsContent>

      <TabsContent value="split" className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="font-mono text-sm"
              style={{ minHeight: height }}
            />
          </div>
          <div
            className="prose prose-lg dark:prose-invert max-w-none border rounded-lg p-6 overflow-auto bg-card"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: preview || '<p class="text-muted-foreground">Nothing to preview</p>' }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

