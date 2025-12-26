// 404 page
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Prevent static generation to avoid client component issues
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}

