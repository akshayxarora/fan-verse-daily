// Dynamic blog post detail page
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { generatePostJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://marketingwithvibes.com';
  
  // Determine post type from URL path
  const pathname = window.location.pathname;
  let postType = 'post';
  if (pathname.includes('/playbook/')) {
    postType = 'playbook';
  } else if (pathname.includes('/guide/')) {
    postType = 'guide';
  }

  // Type for post - must match schema requirements
  type Post = {
    id: string;
    title: string;
    slug: string;
    content: string; // Required
    htmlContent?: string;
    excerpt?: string;
    featuredImage?: string;
    publishedAt?: string | Date;
    createdAt: string | Date; // Required
    updatedAt: string | Date; // Required
    readTime?: number;
    tags: string[]; // Required (can be empty array)
    status: 'draft' | 'published' | 'scheduled'; // Required
    type: 'post' | 'playbook' | 'guide' | 'tool'; // Required
    authorId: string; // Required
    featured: boolean; // Required
    views: number; // Required
    seoTitle?: string;
    seoDescription?: string;
  };

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', postType, slug],
    queryFn: async () => {
      console.log('Fetching post with slug:', slug);
      try {
        const result = await postsApi.getBySlug(slug!);
        const postData = result as Post;
        console.log('Post API response:', {
          title: postData?.title,
          slug: postData?.slug,
          contentLength: postData?.content?.length || 0,
          htmlContentLength: postData?.htmlContent?.length || 0,
          hasContent: !!postData?.content,
          hasHtmlContent: !!postData?.htmlContent,
          status: postData?.status,
        });
        return postData;
      } catch (err: any) {
        console.error('Post API error details:', {
          message: err?.message,
          status: err?.status,
          response: err?.response,
        });
        throw err;
      }
    },
    enabled: !!slug,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container px-4 md:px-6 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Error Loading Post</h1>
            <p className="text-muted-foreground mb-4">
              {(error as any)?.message || 'Failed to load post'}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Slug: {slug}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/blog">
                <Button>Back to Blog</Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
            <p className="text-sm text-muted-foreground mb-8">
              Slug: {slug}
            </p>
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const siteConfig = {
    title: 'Marketing With Vibes',
    description: 'GTM Engineering Blog and Resources',
    url: siteUrl,
    author: 'Marketing With Vibes',
  };

  const jsonLd = generatePostJsonLd(post, siteConfig);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: post.type === 'post' ? 'Blog' : post.type.charAt(0).toUpperCase() + post.type.slice(1), url: post.type === 'post' ? `${siteUrl}/blog` : `${siteUrl}/${post.type}` },
    { name: post.title, url: `${siteUrl}/post/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation />
      <main className="pt-24 pb-16">
        <article className="container px-4 md:px-6 max-w-4xl">
          {/* Back Button */}
          <Link to={post.type === 'post' ? '/blog' : `/${post.type}`}>
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {post.type === 'post' ? 'Blog' : post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </Button>
          </Link>

          {/* Featured Image */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full rounded-lg mb-8"
            />
          )}

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono">
                {post.type}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime || 5} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">Error loading content: {error.message}</p>
            </div>
          )}
          {post.htmlContent || post.content ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-secondary"
              dangerouslySetInnerHTML={{ __html: post.htmlContent || post.content || '' }}
            />
          ) : (
            <div className="p-8 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">No content available</p>
              <p className="text-sm text-muted-foreground mt-2">Debug: content={post.content ? 'exists' : 'missing'}, htmlContent={post.htmlContent ? 'exists' : 'missing'}</p>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}

