'use client';

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingToolbarProps {
  editor: Editor | null;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!editor) return;

    const { selection } = editor.state;
    const { $anchor } = selection;
    const isSelection = !selection.empty;

    if (!isSelection) {
      setIsVisible(false);
      return;
    }

    const coords = editor.view.coordsAtPos($anchor.pos);
    const editorRect = editor.view.dom.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    setPosition({
      top: coords.top - editorRect.top + scrollY - 50,
      left: coords.left - editorRect.left + scrollX - 100,
    });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on('selectionUpdate', updatePosition);
    editor.on('update', updatePosition);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('update', updatePosition);
    };
  }, [editor, updatePosition]);

  if (!editor || !isVisible) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(editor.isActive('bold') && 'bg-secondary')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(editor.isActive('italic') && 'bg-secondary')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(editor.isActive('underline') && 'bg-secondary')}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(editor.isActive('strike') && 'bg-secondary')}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(editor.isActive('code') && 'bg-secondary')}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={cn(editor.isActive('link') && 'bg-secondary')}
        title="Link"
      >
        <Link className="w-4 h-4" />
      </Button>
    </div>
  );
}

