// Markdown rendering utilities
import { marked } from 'marked';
import DOMPurify from 'dompurify';
// sanitize-html is Node.js only - import dynamically for server-side use

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  mangle: false,
} as any);

// Helper to ensure we get string from marked renderer (it sometimes returns objects)
function toString(value: any): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (value && typeof value === 'object') {
    // Handle marked token objects
    if ('text' in value) return String(value.text || '');
    if ('raw' in value) return String(value.raw || '');
    if ('tokens' in value && Array.isArray(value.tokens)) {
      // Recursively process tokens
      return value.tokens.map((t: any) => toString(t)).join('');
    }
    // Try to stringify the object
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value || '');
}

// Helper to render tokens recursively
function renderTokens(tokens: any[]): string {
  if (!Array.isArray(tokens)) {
    if (typeof tokens === 'string') return escapeHtml(tokens);
    if (tokens && typeof tokens === 'object') {
      const tokenObj = tokens as any;
      if (tokenObj.tokens) return renderTokens(tokenObj.tokens);
      if (tokenObj.text) return escapeHtml(tokenObj.text);
      if (tokenObj.raw) return tokenObj.raw;
    }
    return '';
  }
  
  if (tokens.length === 0) return '';
  
  return tokens.map((token: any) => {
    // Handle string tokens
    if (typeof token === 'string') {
      return escapeHtml(token);
    }
    
    // Handle null/undefined
    if (!token || typeof token !== 'object') {
      return '';
    }
    
    // Handle different token types from marked
    const tokenType = token.type || '';
    
    switch (tokenType) {
      case 'text':
        return token.tokens ? renderTokens(token.tokens) : escapeHtml(token.text || '');
      
      case 'strong':
      case 'bold':
        const strongContent = token.tokens ? renderTokens(token.tokens) : (token.text ? escapeHtml(token.text) : (token.raw || ''));
        return `<strong>${strongContent}</strong>`;
      
      case 'em':
      case 'emphasis':
      case 'italic':
        const emContent = token.tokens ? renderTokens(token.tokens) : (token.text ? escapeHtml(token.text) : (token.raw || ''));
        return `<em>${emContent}</em>`;
      
          case 'codespan':
            const codeSpanText = token.text || token.raw || '';
            return `<code class="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-primary">${escapeHtml(codeSpanText)}</code>`;
          
          case 'code':
            const codeBlockText = token.text || token.raw || '';
            const codeLang = token.lang || 'text';
            return `<pre class="bg-secondary rounded-lg p-4 overflow-x-auto my-6 border border-border"><code class="language-${codeLang}">${escapeHtml(codeBlockText)}</code></pre>`;
          
          case 'link':
        const linkText = token.tokens && Array.isArray(token.tokens)
          ? renderTokens(token.tokens)
          : escapeHtml(token.text || '');
        return `<a href="${token.href || ''}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      
      case 'paragraph':
        // Paragraphs in list items should render inline, not as block
        return renderTokens(token.tokens || []);
      
      case 'heading':
        const headingContent = token.tokens && Array.isArray(token.tokens) 
          ? renderTokens(token.tokens) 
          : (token.text ? escapeHtml(token.text) : (token.raw || ''));
        const headingDepth = token.depth || 1;
        return `<h${headingDepth}>${headingContent}</h${headingDepth}>`;
      
      case 'list':
        const listTag = token.ordered ? 'ol' : 'ul';
        const listItems = token.items || '';
        return `<${listTag}>${listItems}</${listTag}>`;
      
      default:
        if (token.tokens && Array.isArray(token.tokens)) {
          return renderTokens(token.tokens);
        }
        if (token.text !== undefined && token.text !== null) {
          return escapeHtml(String(token.text));
        }
        if (token.raw !== undefined && token.raw !== null) {
          return String(token.raw);
        }
        try {
          if (JSON.stringify(token) === '{}') return '';
          return escapeHtml(String(token));
        } catch {
          return '';
        }
    }
  }).join('');
}

// Custom renderer for code blocks with syntax highlighting
const renderer: any = {
  code({ text, lang }: { text: string; lang?: string }) {
    const language = lang || 'text';
    return `<pre class="bg-secondary rounded-lg p-4 overflow-x-auto my-6 border border-border"><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
  },
  heading({ tokens, depth, text }: { tokens?: any[]; text?: any; depth: number }) {
    const content = tokens && Array.isArray(tokens) ? renderTokens(tokens) : toString(text || tokens || '');
    // Clean content for ID generation
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const id = cleanContent.toLowerCase().replace(/[^\w]+/g, '-').substring(0, 50).replace(/^-+|-+$/g, '');
    
    // Just return standard heading tags, CSS will handle the styling
    return `<h${depth}${id ? ` id="${id}"` : ''}>${content}</h${depth}>`;
  },
  paragraph({ tokens, text }: { tokens?: any[]; text?: any }) {
    const content = tokens && Array.isArray(tokens) ? renderTokens(tokens) : toString(text || tokens || '');
    return `<p class="mb-4 leading-relaxed">${content}</p>`;
  },
  link({ href, title, text }: { href: string; title?: string; text: string }) {
    const hrefStr = toString(href);
    const textStr = toString(text);
    const titleStr = title ? toString(title) : null;
    return `<a href="${hrefStr}" ${titleStr ? `title="${titleStr}"` : ''} class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${textStr}</a>`;
  },
  image({ href, title, text }: { href: string; title?: string; text: string }) {
    const hrefStr = toString(href);
    const textStr = toString(text);
    const titleStr = title ? toString(title) : null;
    return `<img src="${hrefStr}" alt="${textStr}" ${titleStr ? `title="${titleStr}"` : ''} class="rounded-lg my-6 w-full" loading="lazy" />`;
  },
  blockquote({ tokens, text }: { tokens?: any[]; text?: any }) {
    const content = tokens && Array.isArray(tokens) ? renderTokens(tokens) : toString(text || tokens || '');
    return `<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic bg-secondary/50 rounded-r">${content}</blockquote>`;
  },
  list({ ordered, items, tokens }: { ordered: boolean; items: any; tokens?: any[] }) {
    const tag = ordered ? 'ol' : 'ul';
    
    // In marked v17, items can be an array of list items or a string
    let itemsStr = '';
    if (Array.isArray(items)) {
      // Render each list item properly
      itemsStr = items.map((item: any) => {
        if (item && typeof item === 'object' && item.type === 'list_item') {
          // Use the listitem renderer for proper rendering
          return renderer.listitem(item);
        }
        // Fallback: try to render as string or use listitem renderer
        if (typeof item === 'string') return item;
        return renderer.listitem({ tokens: item.tokens || [item], task: item.task, checked: item.checked });
      }).join('');
    } else if (typeof items === 'string') {
      // If items is already a string, use it directly
      itemsStr = items;
    } else if (tokens && Array.isArray(tokens)) {
      // Fallback: render tokens if items is not available
      itemsStr = tokens.map((token: any) => {
        if (token.type === 'list_item') {
          return renderer.listitem(token);
        }
        return renderTokens([token]);
      }).join('');
    } else {
      itemsStr = String(items || '');
    }
    
    return `<${tag}>${itemsStr}</${tag}>`;
  },
  listitem({ tokens, task, checked }: { tokens?: any[]; task?: boolean; checked?: boolean }) {
    // In marked v17, listitem receives tokens array that needs to be rendered
    let content = '';
    
    if (tokens && Array.isArray(tokens)) {
      // Render all tokens in the list item - handle nested paragraphs, lists, and other blocks
      content = tokens.map((token: any) => {
        if (typeof token === 'string') {
          return escapeHtml(token);
        }
        if (token && typeof token === 'object') {
          const tokenType = token.type || '';
          
          // If token is a paragraph, render its tokens inline (no <p> tag in list items)
          if (tokenType === 'paragraph' && token.tokens) {
            return renderTokens(token.tokens);
          }
          
          // If token is a nested list, render it properly
          if (tokenType === 'list') {
            return renderer.list({ ordered: token.ordered, items: token.items, tokens: token.tokens });
          }
          
          // For other token types, render normally
          return renderTokens([token]);
        }
        return '';
      }).join('');
    } else if (tokens) {
      // Fallback if tokens is not an array
      content = toString(tokens);
    }
    
    // Handle task lists (checkboxes) - GitHub Flavored Markdown
    if (task !== undefined && task !== null) {
      const checkbox = `<input type="checkbox" ${checked ? 'checked' : ''} disabled class="mr-2" />`;
      return `<li>${checkbox}${content}</li>`;
    }
    
    // Regular list item - CSS will handle bullets/numbers with proper alignment
    if (!content.trim()) {
      // If no content, return empty list item (shouldn't happen, but handle gracefully)
      return `<li></li>`;
    }
    
    return `<li>${content}</li>`;
  },
};

marked.use({ renderer });

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Render markdown to HTML
 * Works in both browser and server environments
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // Check if it's already HTML to avoid re-parsing
    const isHtml = markdown.includes('<p>') || markdown.includes('<div>') || markdown.includes('<h1>') || markdown.includes('<pre>');
    
    // If it's HTML, we still run it through marked but it should be safer now
    // Actually, if it's HTML, we should probably just return it sanitized
    // but marked is used for gfm etc.
    const html = marked.parse(markdown) as string;
    
    // Sanitize HTML - DOMPurify only works in browser
    if (typeof window !== 'undefined' && typeof DOMPurify !== 'undefined') {
      // Browser environment - use DOMPurify
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'hr',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'iframe',
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'loading', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'style'],
      } as any);
      return String(sanitized);
    } else {
      // Server environment - sanitize-html is imported dynamically in API routes
      // For now, return HTML (server-side API routes will handle sanitization)
      // This prevents bundling sanitize-html in the browser bundle
      return html;
    }
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return markdown; // Fallback to raw markdown
  }
}

/**
 * Calculate reading time from markdown content
 */
export function calculateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const text = markdown.replace(/[#*`\[\]()]/g, '').trim();
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract excerpt from markdown (first paragraph)
 */
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const text = markdown
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
    .replace(/[*_`]/g, '') // Remove emphasis
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

