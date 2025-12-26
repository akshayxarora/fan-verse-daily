// Server-side code injection component that passes data to a client-side injector
import { query } from '@/lib/db/client';
import CodeInjectionClient from './CodeInjectionClient';

interface CodeInjectionProps {
  location: 'head' | 'body' | 'footer';
}

export default async function CodeInjection({ location }: CodeInjectionProps) {
  try {
    // Fetch enabled injections for this location
    const injections = await query(
      'SELECT id, code, description FROM code_injections WHERE location = $1 AND enabled = TRUE',
      [location === 'body' ? 'footer' : location] // Normalize location
    );

    if (!injections || injections.length === 0) {
      return null;
    }

    // Process all injections into a single HTML string
    const htmlToInject = injections.map((inj: any) => {
      const metaComment = `\n<!-- MWV-INJECTION: ${inj.description || 'Custom Code'} -->\n`;
      return `${metaComment}${inj.code}`;
    }).join('\n');

    // We use a Client Component to handle the actual DOM manipulation
    // This avoids hydration errors and ensures scripts are executed correctly
    return <CodeInjectionClient html={htmlToInject} location={location === 'head' ? 'head' : 'footer'} />;
  } catch (error) {
    console.error(`Error in CodeInjection (${location}):`, error);
    return null;
  }
}
