'use client';

// Admin posts management page
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, Calendar, Star, Layout } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Type for post
type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  hero: boolean;
  publishedAt?: string;
  createdAt: string;
  views?: number;
};

export default function AdminPosts() {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['admin-posts', filter],
    queryFn: async () => {
      const result = await postsApi.getAll({ status: filter === 'all' ? undefined : filter });
      return Array.isArray(result) ? result : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => postsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Post updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Update failed');
    },
  });

  const toggleFeatured = (post: Post) => {
    updateMutation.mutate({
      id: post.id,
      data: { featured: !post.featured }
    });
  };

  const setAsHero = (post: Post) => {
    updateMutation.mutate({
      id: post.id,
      data: { hero: true }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts, playbooks, and guides</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'published' ? 'default' : 'outline'}
          onClick={() => setFilter('published')}
        >
          Published
        </Button>
        <Button
          variant={filter === 'draft' ? 'default' : 'outline'}
          onClick={() => setFilter('draft')}
        >
          Drafts
        </Button>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{post.title}</CardTitle>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground tracking-tight">
                        {post.type}
                      </span>
                      {post.hero && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 tracking-tight flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Hero
                        </span>
                      )}
                      {post.featured && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/20 text-primary tracking-tight">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-1">{post.excerpt || 'No excerpt'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`featured-${post.id}`}
                          checked={post.featured} 
                          onCheckedChange={() => toggleFeatured(post)}
                        />
                        <Label htmlFor={`featured-${post.id}`} className="text-xs cursor-pointer">Featured</Label>
                      </div>
                      <Button
                        variant={post.hero ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-7 text-[10px] uppercase font-bold",
                          post.hero && "bg-amber-500 hover:bg-amber-600 border-none"
                        )}
                        onClick={() => !post.hero && setAsHero(post)}
                        disabled={post.hero || updateMutation.isPending}
                      >
                        <Layout className="w-3 h-3 mr-1" />
                        {post.hero ? 'Current Hero' : 'Set as Hero'}
                      </Button>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views || 0} views
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      post.status === 'published' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === 'published' && (
                      <Link href={`/post/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.slug}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No posts found. Create your first post!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

