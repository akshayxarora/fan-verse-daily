'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { SlashCommandItem } from './SlashCommand';

interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandList = forwardRef<any, SlashCommandListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-card border border-border rounded-lg shadow-2xl p-1 min-w-[280px] max-h-[300px] overflow-y-auto">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
              index === selectedIndex
                ? 'bg-primary/10 text-foreground'
                : 'text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <span className="text-lg w-6 text-center font-semibold">{item.icon || '•'}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.title}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
      )}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

