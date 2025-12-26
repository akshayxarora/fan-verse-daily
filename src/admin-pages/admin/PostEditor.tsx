'use client';

// Notion-like post editor page for creating/editing posts
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, uploadApi } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import NotionEditor from '@/components/admin/NotionEditor';
import { toast } from 'sonner';
import { Save, Upload, X, ChevronRight, Settings, Search, Image as ImageIcon, Send } from 'lucide-react';
import { calculateReadingTime, extractExcerpt } from '@/lib/markdown';
import { useRef } from 'react';
import { ClientOnly } from '@/components/ClientOnly';

export default function PostEditor() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!slug;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    excerpt: '',
    type: 'post' as 'post' | 'playbook' | 'guide' | 'tool',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    featured: false,
    hero: false,
    sendNewsletter: true,
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    tags: [] as string[],
    tagInput: '',
  });

  // Auto-resize textareas on content change
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [formData.title]);

  useEffect(() => {
    if (subtitleRef.current) {
      subtitleRef.current.style.height = 'auto';
      subtitleRef.current.style.height = subtitleRef.current.scrollHeight + 'px';
    }
  }, [formData.subtitle]);

  // Track if fields have been manually edited
  const [manualFields, setManualFields] = useState({
    slug: false,
    seoTitle: false,
    seoDescription: false,
    excerpt: false,
  });

  const handleFieldChange = (field: string, value: any, isManual: boolean = true) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (isManual && field in manualFields) {
      setManualFields(prev => ({ ...prev, [field]: true }));
    }
  };

  type PostData = {
    id: string;
    title?: string;
    subtitle?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    type?: string;
    status?: string;
    featured?: boolean;
    hero?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    featuredImage?: string;
    tags?: string[];
    sendNewsletter?: boolean;
  };

  const { data: existingPost, isLoading, error } = useQuery<PostData>({
    queryKey: ['post', slug],
    queryFn: async () => {
      const result = await postsApi.getBySlug(slug!);
      return result as PostData;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      // Use htmlContent if available (for WYSIWYG), otherwise use content
      // The editor works with HTML, so we prefer htmlContent
      const editorContent = (existingPost as any).htmlContent || existingPost.content || '';
      
      setFormData({
        title: existingPost.title || '',
        subtitle: existingPost.subtitle || '',
        slug: existingPost.slug || '',
        content: editorContent, // Use HTML content for WYSIWYG editor
        excerpt: existingPost.excerpt || '',
        type: (existingPost.type as 'post' | 'playbook' | 'guide' | 'tool') || 'post',
        status: (existingPost.status as 'draft' | 'published' | 'scheduled') || 'draft',
        featured: existingPost.featured || false,
        hero: existingPost.hero || false,
        sendNewsletter: existingPost.sendNewsletter !== undefined ? existingPost.sendNewsletter : true,
        seoTitle: existingPost.seoTitle || '',
        seoDescription: existingPost.seoDescription || '',
        featuredImage: existingPost.featuredImage || '',
        tags: existingPost.tags || [],
        tagInput: '',
      });
    }
  }, [existingPost]);

  useEffect(() => {
    if (error) {
      console.error('Post editor - error loading post:', error);
      toast.error('Failed to load post: ' + (error as any)?.message);
    }
  }, [error]);

  // Auto-generate SEO fields from title, subtitle, and content
  useEffect(() => {
    setFormData(prev => {
      const updates: any = {};
      
      // Auto-generate slug from title
      if (prev.title && !manualFields.slug && (prev.status === 'draft' || !isEditing)) {
        const generatedSlug = prev.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (prev.slug !== generatedSlug) {
          updates.slug = generatedSlug;
        }
      }

      // Auto-generate SEO Title from title
      if (prev.title && !manualFields.seoTitle) {
        if (prev.seoTitle !== prev.title) {
          updates.seoTitle = prev.title;
        }
      }

      // Auto-generate SEO Description from Subtitle
      if (prev.subtitle && !manualFields.seoDescription) {
        const newSeoDesc = prev.subtitle.substring(0, 160);
        if (prev.seoDescription !== newSeoDesc) {
          updates.seoDescription = newSeoDesc;
        }
      }

      // Auto-generate SEO Excerpt from first paragraph of content
      if (prev.content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(prev.content, 'text/html');
        const firstP = doc.querySelector('p');
        const cleanText = firstP ? firstP.textContent || '' : doc.body.textContent || '';
        const trimmedText = cleanText.trim().replace(/\s+/g, ' ');
        
        if (trimmedText && !manualFields.excerpt) {
          const newExcerpt = trimmedText.substring(0, 300);
          if (prev.excerpt !== newExcerpt) {
            updates.excerpt = newExcerpt;
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, [formData.title, formData.subtitle, formData.content, manualFields, isEditing, formData.status]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        return postsApi.update(existingPost.id, data);
      } else {
        return postsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
      toast.success(isEditing ? 'Post updated successfully' : 'Post created successfully');
      router.push('/admin/posts');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save post');
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      toast.loading('Uploading image...');
      const result = await uploadApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, featuredImage: result.url }));
      toast.dismiss();
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = (statusOverride?: 'draft' | 'published' | 'scheduled') => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const excerpt = formData.excerpt || extractExcerpt(formData.content);
    const finalStatus = statusOverride || formData.status;

    saveMutation.mutate({
      ...formData,
      status: finalStatus,
      excerpt,
      readTime: calculateReadingTime(formData.content),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/posts')}
          >
            <X className="w-4 h-4" />
          </Button>
        <div>
            <h1 className="text-lg font-semibold">{isEditing ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-xs text-muted-foreground">
              {formData.slug || 'Untitled'} • {formData.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSave('draft')} 
            disabled={saveMutation.isPending}
          >
          <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saveMutation.isPending}>
            <Send className="w-4 h-4 mr-2" />
            {formData.status === 'published' ? (saveMutation.isPending ? 'Updating...' : 'Update') : 'Publish'}
        </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area - Maximized */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
                {/* Title Input - Notion Style */}
                <div className="mb-2">
                  <Textarea
                    ref={titleRef}
                  value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value, false)}
                    placeholder="Untitled"
                    className="text-5xl md:text-6xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto min-h-[unset] resize-none overflow-hidden leading-tight"
                    rows={1}
                  />
                </div>

                {/* Subtitle / Excerpt Input */}
                <div className="mb-8">
                  <Textarea
                    ref={subtitleRef}
                    value={formData.subtitle}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    placeholder="Add a subtitle..."
                    className="text-2xl text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto min-h-[unset] resize-none overflow-hidden leading-relaxed"
                    rows={1}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <span className="font-mono opacity-50">/post/{formData.slug || 'untitled'}</span>
                    {formData.featuredImage && (
                      <span className="flex items-center gap-1 ml-4 text-primary/70">
                        <ImageIcon className="w-3 h-3" />
                        Featured image set
                      </span>
                    )}
                  </div>
                </div>

            {/* Featured Image Upload - Inline */}
            {!formData.featuredImage && (
              <div className="mb-8">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: any) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    };
                    input.click();
                  }}
                >
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload featured image</p>
                </div>
              </div>
            )}

            {formData.featuredImage && (
              <div className="mb-8 relative group">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Notion Editor */}
            <NotionEditor
              content={formData.content}
              onChange={(value) => handleFieldChange('content', value, false)}
              placeholder="Type '/' for commands..."
            />
          </div>
              </div>

        {/* Collapsible Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Settings */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold mb-4">
                  <span>Settings</span>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
              <div>
                    <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <ClientOnly>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => handleFieldChange('type', value, false)}
                  >
                    <SelectTrigger suppressHydrationWarning>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="playbook">Playbook</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </ClientOnly>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleFieldChange('featured', checked, false)}
                />
              </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="hero">Hero Post</Label>
                      <p className="text-[10px] text-muted-foreground italic">Primary homepage slot</p>
                    </div>
                    <Switch
                      id="hero"
                      checked={formData.hero}
                      onCheckedChange={(checked) => handleFieldChange('hero', checked, false)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sendNewsletter">Send Newsletter</Label>
                      <p className="text-xs text-muted-foreground">Notify subscribers</p>
                </div>
                    <Switch
                      id="sendNewsletter"
                      checked={formData.sendNewsletter}
                      onCheckedChange={(checked) => handleFieldChange('sendNewsletter', checked, false)}
                />
              </div>
                </CollapsibleContent>
              </Collapsible>

              {/* SEO Optimization */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold mb-4">
                  <span>SEO Optimization</span>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                  placeholder={formData.title || 'SEO title'}
                />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.seoTitle.length}/60 characters
                    </p>
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                  placeholder={formData.excerpt || 'SEO description'}
                  rows={3}
                />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.seoDescription.length}/160 characters
                    </p>
              </div>

                      <div>
                        <Label htmlFor="excerpt">SEO Excerpt</Label>
              <Textarea
                          id="excerpt"
                value={formData.excerpt}
                          onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                          placeholder="Brief description for social sharing (auto-generated)"
                rows={3}
              />
                      </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Tags */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold mb-4">
                  <span>Tags</span>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={formData.tagInput}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagInput: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag"
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary text-secondary-foreground text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
