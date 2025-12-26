'use client';

// Admin dashboard page with analytics
import { useQuery } from '@tanstack/react-query';
import { postsApi, analyticsApi, newsletterApi } from '@/lib/api/client';
import { FileText, Mail, Eye, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Type for analytics response
type AnalyticsResponse = {
  global?: {
    totalPosts?: number;
    publishedPosts?: number;
    totalViews?: number;
    totalSubscribers?: number;
    activeSubscribers?: number;
  };
  topPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
    published_at: string;
  }>;
};

// Type for post
type Post = {
  id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  views?: number;
  readTime?: number;
};

export default function AdminDashboard() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const result = await postsApi.getAll({ status: 'published', limit: 10 });
      return Array.isArray(result) ? result : [];
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics-global'],
    queryFn: () => analyticsApi.getGlobal(),
  });

  const { data: subscribers } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: () => newsletterApi.getSubscribers(),
  });

  const stats = [
    {
      title: 'Published Posts',
      value: analytics?.global?.publishedPosts || 0,
      icon: FileText,
      description: 'Total published content',
      link: '/admin/posts',
    },
    {
      title: 'Total Views',
      value: analytics?.global?.totalViews || 0,
      icon: Eye,
      description: 'All-time views',
    },
    {
      title: 'Newsletter Subscribers',
      value: analytics?.global?.activeSubscribers || 0,
      icon: Mail,
      description: 'Active subscribers',
      link: '/admin/newsletter',
    },
    {
      title: 'Total Subscribers',
      value: analytics?.global?.totalSubscribers || 0,
      icon: Users,
      description: 'All subscribers',
      link: '/admin/newsletter',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const cardContent = (
            <Card className={stat.link ? 'hover:border-primary/50 transition-colors cursor-pointer' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
          
          return stat.link ? (
            <Link key={stat.title} href={stat.link} className="block">
              {cardContent}
            </Link>
          ) : (
            <div key={stat.title}>
              {cardContent}
            </div>
          );
        })}
      </div>

      {/* Top Posts */}
      {analytics?.topPosts && analytics.topPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Posts with the most views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPosts.map((post: any, index: number) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{post.views || 0}</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                    <Link href={`/admin/posts/${post.slug}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your latest published content</CardDescription>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime || 0} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No posts yet. Create your first post!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
