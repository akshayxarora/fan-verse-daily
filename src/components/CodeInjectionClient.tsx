'use client';

import { useEffect, useRef } from 'react';

interface CodeInjectionClientProps {
  html: string;
  location: 'head' | 'footer';
}

export default function CodeInjectionClient({ html, location }: CodeInjectionClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    // To execute scripts, we need to manually create and append them
    // contextualFragment is a great way to handle this for scripts
    const range = document.createRange();
    const fragment = range.createContextualFragment(html);
    
    // We want to avoid double injection if the component re-renders
    // But since it's in a useEffect with [html], it should be fine.
    // However, to be safe, let's clear previous injections if we had any
    const id = `mwv-injected-${location}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = id;
    container.style.display = 'none';
    container.appendChild(fragment);

    if (location === 'head') {
      document.head.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    return () => {
      container.remove();
    };
  }, [html, location]);

  return <div ref={containerRef} style={{ display: 'none' }} />;
}

