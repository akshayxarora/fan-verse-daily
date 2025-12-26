'use client';

import { Node, mergeAttributes } from '@tiptap/core';

export const Iframe = Node.create({
  name: 'iframe',

  addOptions() {
    return {
      HTMLAttributes: {},
      allowFullscreen: true,
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      style: {
        default: null,
      },
      class: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400px',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          const element = node as HTMLElement;
          return {
            src: element.getAttribute('src'),
            frameborder: element.getAttribute('frameborder') || '0',
            allowfullscreen: element.hasAttribute('allowfullscreen'),
            style: element.getAttribute('style'),
            class: element.getAttribute('class'),
            width: element.getAttribute('width') || '100%',
            height: element.getAttribute('height') || '400px',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setIframe: (options: { src: string; [key: string]: any }) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    } as any;
  },
});

