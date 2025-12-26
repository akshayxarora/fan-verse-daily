'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { SlashCommand } from './SlashCommand';
import { Iframe } from './IframeExtension';
import { FloatingToolbar } from './FloatingToolbar';
import { uploadApi } from '@/lib/api/client';
import { toast } from 'sonner';
import { renderMarkdown } from '@/lib/markdown';
import 'tippy.js/dist/tippy.css';

interface NotionEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function NotionEditor({ content, onChange, placeholder, className }: NotionEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-secondary rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 py-2 my-4 italic bg-secondary/50 rounded-r',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'my-1',
          },
        },
      }),
      Underline,
      Strike,
      Placeholder.configure({
        placeholder: placeholder || 'Type "/" for commands...',
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg my-4 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Iframe.configure({
        HTMLAttributes: {
          class: 'w-full',
          allowfullscreen: true,
        },
      }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }: any) => {
            const items = [
              {
                title: 'Heading 1',
                description: 'Large section heading',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
                },
                icon: 'H1',
              },
              {
                title: 'Heading 2',
                description: 'Medium section heading',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
                },
                icon: 'H2',
              },
              {
                title: 'Heading 3',
                description: 'Small section heading',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
                },
                icon: 'H3',
              },
              {
                title: 'Bullet List',
                description: 'Create a bulleted list',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).toggleBulletList().run();
                },
                icon: '•',
              },
              {
                title: 'Numbered List',
                description: 'Create a numbered list',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                },
                icon: '1.',
              },
              {
                title: 'Quote',
                description: 'Add a quote block',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
                icon: '"',
              },
              {
                title: 'Code Block',
                description: 'Add a code block',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                },
                icon: '</>',
              },
              {
                title: 'Image',
                description: 'Upload and insert an image',
                command: async ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).run();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        toast.loading('Uploading image...');
                        const result = await uploadApi.uploadImage(file);
                        editor.chain().focus().setImage({ src: result.url, alt: file.name }).run();
                        toast.dismiss();
                        toast.success('Image uploaded');
                      } catch (error: any) {
                        toast.dismiss();
                        toast.error(error.message || 'Failed to upload image');
                      }
                    }
                  };
                  input.click();
                },
                icon: '🖼️',
              },
              {
                title: 'Video (YouTube)',
                description: 'Embed a YouTube video',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).run();
                  const url = prompt('Enter YouTube URL:');
                  if (url) {
                    const videoId = extractYouTubeId(url);
                    if (videoId) {
                      // Insert iframe wrapped in a div for proper styling
                      editor.chain().focus().insertContent(`
                        <div class="youtube-embed my-4" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
                          <iframe 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 8px;"
                          ></iframe>
                        </div>
                      `).run();
                    } else {
                      toast.error('Invalid YouTube URL');
                    }
                  }
                },
                icon: '▶️',
              },
              {
                title: 'Embed',
                description: 'Embed external content',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).run();
                  const url = prompt('Enter embed URL:');
                  if (url) {
                    // Insert iframe wrapped in a div for proper styling
                    editor.chain().focus().insertContent(`
                      <div class="embed-wrapper my-4" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
                        <iframe 
                          src="${url}" 
                          frameborder="0"
                          allowfullscreen
                          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
                        ></iframe>
                      </div>
                    `).run();
                  }
                },
                icon: '🔗',
              },
              {
                title: 'Divider',
                description: 'Add a horizontal divider',
                command: ({ editor, range }: any) => {
                  editor.chain().focus().deleteRange(range).setHorizontalRule().run();
                },
                icon: '—',
              },
            ];

            return items.filter((item: any) =>
              item.title.toLowerCase().startsWith(query.toLowerCase())
            );
          },
        },
      }),
    ],
    content,
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      // Check if content is HTML (has HTML tags) or markdown
      const isHTML = content.includes('<p>') || 
                     content.includes('<div>') || 
                     content.includes('<h1>') || 
                     content.includes('<h2>') || 
                     content.includes('<h3>') ||
                     content.includes('<h4>') ||
                     content.includes('<h5>') ||
                     content.includes('<h6>') ||
                     content.includes('<ul>') ||
                     content.includes('<ol>') ||
                     content.includes('<blockquote>') ||
                     content.includes('<code>') ||
                     content.includes('<pre>') ||
                     content.includes('<img') ||
                     content.includes('<iframe');
      
      if (!isHTML && content.trim()) {
        // Content appears to be markdown - convert to HTML for WYSIWYG display
        try {
          const htmlContent = renderMarkdown(content);
          // Use setContent to ensure all nodes are parsed correctly
          if (htmlContent !== editor.getHTML()) {
            editor.commands.setContent(htmlContent);
          }
        } catch (error) {
          console.error('Error converting markdown to HTML:', error);
          // Fallback to setting content as-is
          if (content !== editor.getHTML()) {
            editor.commands.setContent(content);
          }
        }
      } else {
        // Content is already HTML - use as-is with proper parsing
        if (content !== editor.getHTML()) {
          editor.commands.setContent(content);
        }
      }
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="border border-border rounded-lg bg-background min-h-[600px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`border border-border rounded-lg bg-background overflow-hidden relative ${className || ''}`}>
      {editor && <FloatingToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

